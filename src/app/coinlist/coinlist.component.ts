import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

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
  constructor(private api:ApiService , private router: Router){

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
  }
  getAllData() { //for table data
    this.api.getCurrency(this.currency)
      .subscribe(res => {
        console.log("getAllData",res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }
  getBannerData() {
    this.api.getTrendingCurrency(this.currency)
      .subscribe(res => {
        console.log("getBannerData",res);
        this.bannerData = res;
      })
  }
}
