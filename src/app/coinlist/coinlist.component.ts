import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-coinlist',
  templateUrl: './coinlist.component.html',
  styleUrls: ['./coinlist.component.scss']
})
export class CoinlistComponent implements OnInit{
  bannerData :any= [];
  currency:string="INR";
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private api:ApiService , private router: Router,private currencyService:CurrencyService){

  }
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['symbol', 'current_price', 'price_change_percentage_24h', 'market_cap']; //from API field_names


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  gotoDetails(row: any) {
    this.router.navigate(['coin-detail',row.id]) // navigate to coin-detail/:id
  }
  ngOnInit(): void {
  this.getBannerData();
  this.getAllData();
  this.currencyService.getCurrency() //inject currencyService,subscribe getter 
  .subscribe((val: string)=>{
    this.currency = val;
    this.getAllData();
    this.getBannerData();
  })
  }
  getAllData() { //for table data
    this.api.getCurrency(this.currency)
      .subscribe(res => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }
  getBannerData() {
    this.api.getTrendingCurrency(this.currency)
      .subscribe(res => {
        this.bannerData = res;
      })
  }
}
