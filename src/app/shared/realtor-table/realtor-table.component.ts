import { Component, 
  Input, 
  Output, 
  EventEmitter, 
  OnInit, 
  OnChanges }                       from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'realtor-table',
  templateUrl: './realtor-table.component.html',
  inputs: ['columns', 'data'],
  outputs: ['selectedRow']
})

export class RealtorTableComponent implements OnInit {
  columns: Array<any>;
  data: Array<any>;
  public selectedRow = new EventEmitter();

  constructor() {}

  public rows:Array<any> = [];

  public page:number = 1;
  public itemsPerPage:number = 10;
  public maxSize:number = 5;
  public numPages:number = 1;
  public length:number = 0;

  public tableConfig:any = {};    

  ngOnInit(): void {
    this.tableConfig = {
        paging: true,
        sorting: {columns: this.columns},
        filtering: {filterString: ''},
        className: ['table-striped', 'table-bordered']
    };
    this.length = this.data.length;
    this.onChangeTable(this.tableConfig);
  }

  ngOnChanges(changes) {
    //   this.onChangeTable(this.tableConfig);
  }

  public changePage(page:any, data:Array<any> = this.data):Array<any> {
    let start = (page.page - 1) * page.itemsPerPage;
    let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
    return data.slice(start, end);
  }

  public changeSort(data:any, tableConfig:any):any {
    if (!tableConfig.sorting) {
      return data;
    }

    let columns = this.tableConfig.sorting.columns || [];
    let columnName:string = void 0;
    let sort:string = void 0;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort !== '' && columns[i].sort !== false) {
        columnName = columns[i].name;
        sort = columns[i].sort;
      }
    }

    if (!columnName) {
      return data;
    }

    // simple sorting
    return data.sort((previous:any, current:any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  public changeFilter(data:any, tableConfig:any):any {
    let filteredData:Array<any> = data;
    this.columns.forEach((column:any) => {
      if (column.filtering) {
        filteredData = filteredData.filter((item:any) => {
          return item[column.name].match(column.filtering.filterString);
        });
      }
    });

    if (!tableConfig.filtering) {
      return filteredData;
    }

    if (tableConfig.filtering.columnName) {
      return filteredData.filter((item:any) =>
        item[tableConfig.filtering.columnName].match(this.tableConfig.filtering.filterString));
    }

    let tempArray:Array<any> = [];
    filteredData.forEach((item:any) => {
      let flag = false;
      this.columns.forEach((column:any) => {
        if (item[column.name].toString().match(this.tableConfig.filtering.filterString)) {
          flag = true;
        }
      });
      if (flag) {
        tempArray.push(item);
      }
    });
    filteredData = tempArray;

    return filteredData;
  }

  public onChangeTable(tableConfig:any, page:any = {page: this.page, itemsPerPage: this.itemsPerPage}):any {
    if (tableConfig.filtering) {
      Object.assign(this.tableConfig.filtering, tableConfig.filtering);
    }

    if (tableConfig.sorting) {
      Object.assign(this.tableConfig.sorting, tableConfig.sorting);
    }

    let filteredData = this.changeFilter(this.data, this.tableConfig);
    let sortedData = this.changeSort(filteredData, this.tableConfig);
    this.rows = page && tableConfig.paging ? this.changePage(page, sortedData) : sortedData;
    this.length = sortedData.length;
  }

  public onCellClick(data: any): any {
    this.selectedRow.emit({
      value: data
    })
    console.log(data);
  }
}
