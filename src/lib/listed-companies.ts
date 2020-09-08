import puppeteer, { Page } from 'puppeteer';
import { collectAllMatches, clearLines } from './helpers';
import { IB3Assets } from './models';
import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';

export class ListedCompanies {
  private uri = 'http://bvmf.bmfbovespa.com.br/cias-listadas/empresas-listadas/BuscaEmpresaListada.aspx?idioma=pt-br';
  private allCompanies = '#ctl00_contentPlaceHolderConteudo_BuscaNomeEmpresa1_btnTodas';
  private regExpToGetCompanyId = /<a href="ResumoEmpresaPrincipal\.aspx\?codigoCvm=(.*?)">/g;
  private regExpToGetAtivo = /javascript:VerificaCotacao\('([^)]*)',/g;
  private detailPage = 'http://bvmf.bmfbovespa.com.br/pt-br/mercados/acoes/empresas/ExecutaAcaoConsultaInfoEmp.asp?CodCVM='

  private acessPage = async (): Promise<Page> => {
    const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
    });
    const page = await browser.newPage();
    await page.goto(this.uri);
    return page;
  }

  private goTo = async (selector: string, page: Page): Promise<Page> => {    
    await page.click(selector);
    await page.waitFor(5000);
    return page;
  }

  private getAllCompanies = async (page: Page, regExp: RegExp): Promise<string[]> => {
    const body = await page.evaluate(() => document.body.innerHTML);
    const matches = collectAllMatches(regExp, body)
    return matches;
  }

  private getDetailPage = (page: string): IB3Assets[] => {
    const $ = cheerio.load(page);
    const ativos = this.getStockCod(page, this.regExpToGetAtivo);
    const nomePregao = $('#accordionDados > table > tbody > tr:nth-child(1) > td:nth-child(2)').text();
    const cnpj = $('#accordionDados > table > tbody > tr:nth-child(3) > td:nth-child(2)').text();
    const atividadePrincipal = $('#accordionDados > table > tbody > tr:nth-child(4) > td:nth-child(2)').text();
    const segmento = $('#accordionDados > table > tbody > tr:nth-child(5) > td:nth-child(2)').text();
    const site = $('#accordionDados > table > tbody > tr:nth-child(6) > td:nth-child(2)').text();
    const details: IB3Assets[] = [];
    for (const ativo of ativos) {
      const data = {
        ativo,
        nomePregao,
        cnpj,
        atividadePrincipal,
        segmento,
        site
      };
      details.push(data);
    }
    return details;
  }

  private requestPage = async (codCvm: string): Promise<AxiosResponse<string>> => {
    const page = await axios.get<string>(`${this.detailPage}${codCvm}`);
    return page;
  }

  private getStockCod = (page: string, regExp: RegExp): string[] => {
    const matches = collectAllMatches(regExp, page)
    return matches;
  }

  get = async (): Promise<IB3Assets[]> => {
    const page = await this.acessPage();
    const allCompaniesPage = await this.goTo(this.allCompanies, page);
    const companiesId = await this.getAllCompanies(allCompaniesPage, this.regExpToGetCompanyId);
    page.close();
    page.close();
    
    let index = 0; 
    const responseData: IB3Assets[] = [];
    for (const id of companiesId) {
      const { data } = await this.requestPage(id);
      const response = this.getDetailPage(data)
      responseData.push(...response);
      clearLines(2);
      index += 1;
      process.stdout.write(`Assets: ${index}/${companiesId.length}\n${((index / companiesId.length) * 100).toFixed(2)}%`);
    }
    return responseData;
  }
}