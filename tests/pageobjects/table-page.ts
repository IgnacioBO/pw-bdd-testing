import { expect, Locator, Page } from '@playwright/test';
import {CountryVisited} from '../models/country-visited';
import {randomIntFromInterval} from '../utils/generic-functions'

export class TablePage{
    private readonly page: Page;
    private readonly titleHeading: Locator;
    private readonly table: Locator;
    private readonly tableRows: Locator;
    private readonly tableHeader: Locator;
    private readonly headerRowIndex: number = 0;
    private countryColumnIndex: number = 0;
    private capitalColumnIndex: number = 0;
    private currencyColumnIndex: number = 0;
    private languageColumnIndex: number = 0;
    private visitedColumnIndex: number = 0;

    constructor(page: Page) {
        this.page = page;
        this.titleHeading = page.getByRole('heading', { name: 'WebTable' });
        this.table = page.locator('#countries');
        this.tableHeader = this.table.locator('tbody tr').nth(this.headerRowIndex);
        this.tableRows = this.table.locator('tbody tr');
    }

    async goTo() {
        await this.page.goto('https://web.archive.org/web/20251216160202/https://cosmocode.io/automation-practice-webtable/');
    }

    async validateTitle() {
        await expect(this.titleHeading).toBeVisible();
    }

    //Funcion que determinara lo el indice de columna segun el nombre de la columna, para luego usar ese indice para obtener el valor de esa columna en una fila determinada.
    async getColumnIndexByName() {
        const headerRow = this.tableRows.nth(this.headerRowIndex);
        const headerCells = headerRow.locator('td').all();
        let index = 0;

        for (const header of await headerCells) {
            const headerText = await header.innerText();
            if (headerText.toLocaleLowerCase().includes('country')) {
                this.countryColumnIndex = index;
            }
            if (headerText.toLocaleLowerCase().includes('capital')) {
                this.capitalColumnIndex = index;
            }
            if (headerText.toLocaleLowerCase().includes('currency')) {
                this.currencyColumnIndex = index;
            }
            if (headerText.toLocaleLowerCase().includes('language')) {
                this.languageColumnIndex = index;
            }
            if (headerText.toLocaleLowerCase().includes('visited')) {
                this.visitedColumnIndex = index;
            }
            index++;
        }
    }

    async checkRadomCountryVisited(quantity: number) {
        for (let i = 0; i < quantity; i++) {
            const randomRow = randomIntFromInterval((this.headerRowIndex + 1), (await this.tableRows.count() - 1))
            const row = this.tableRows.nth(randomRow);
            await row.locator('td').nth(this.visitedColumnIndex).locator('input[type="checkbox"]').check();
        }
    }

    async imprimirTabla() {
        const rowCount = await this.tableRows.count();
        for (let i = 0; i < rowCount; i++) {
            if(i === this.headerRowIndex) continue; // Saltar la fila de encabezado
            const row = this.tableRows.nth(i);
            console.log(``);
            let rowText = `${i}->`;
            for (let j = 0; j < await row.locator('td').count(); j++) {
                const headerText = await this.tableHeader.locator('td').nth(j).innerText();
                let cellText = await row.locator('td').nth(j).innerText();
                if(j === this.visitedColumnIndex) {
                    cellText = (await row.locator('td').nth(j).locator('input[type="checkbox"]').isChecked()).valueOf().toString();
                }
                rowText += `${headerText}:${cellText} | `;
            }
            console.log(rowText);
        }
    }

    async guardarTablaEnInterface(): Promise<CountryVisited[]> {
        const rowCount = await this.tableRows.count();
        const countries: CountryVisited[] = [];
        for (let i = 0; i < rowCount; i++) {
            if(i === this.headerRowIndex) continue; // Saltar la fila de encabezado
            const row = this.tableRows.nth(i);
            const country = await row.locator('td').nth(this.countryColumnIndex).innerText();
            const capital = await row.locator('td').nth(this.capitalColumnIndex).innerText(); // Suponiendo que las capitales están separadas por comas
            const currency = await row.locator('td').nth(this.currencyColumnIndex).innerText();
            const language = await row.locator('td').nth(this.languageColumnIndex).innerText();
            const visited: boolean = await row.locator('td').nth(this.visitedColumnIndex).locator('input[type="checkbox"]').isChecked();
            countries.push({ country: country, capital: capital.split(';'), currency: currency, language: language.split(';'), visited });
        }
        return countries;
    }





}