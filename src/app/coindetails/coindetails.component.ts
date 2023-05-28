import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-coindetails',
  templateUrl: './coindetails.component.html',
  styleUrls: ['./coindetails.component.scss']
})
export class CoindetailsComponent implements OnInit {
  days: number = 30;

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute, private currencyService: CurrencyService) {

  }
  getGraphData(days: number) {
    this.days = days
    this.api.getGrpahicalCurrencyData(this.coinId, this.currency, this.days)
      .subscribe(res => {
        setTimeout(() => {
          this.myLineChart.chart?.update(); //updateChart
        }, 200);
        this.lineChartData.datasets[0].data = res.prices.map((a: any) => {
          return a[1];
        });
        this.lineChartData.labels = res.prices.map((a: any) => {
          let date = new Date(a[0]); //timestamp to date
          let time = date.getHours() > 12 ?
            `${date.getHours() - 12}: ${date.getMinutes()} PM` :
            `${date.getHours()}: ${date.getMinutes()} AM`
          return this.days === 1 ? time : date.toLocaleDateString();
        })
      })
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(val => {
      this.coinId = val['id']; //getcoinid from activatedRoute
    });
    this.currencyService.getCurrency() //inject currencyService,subscribe getter 
      .subscribe((val: string) => {
        this.currency = val;
        this.getCoinData();
        this.getGraphData(this.days);
      })
  }
  coinData: any;
  coinId !: string;
  currency: string = 'INR'
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: `Price Trends`,
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: '#009688',
        pointBackgroundColor: '#009688',
        pointBorderColor: '#009688',
        pointHoverBackgroundColor: '#009688',
        pointHoverBorderColor: '#009688',

      }
    ],
    labels: []
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      point: {
        radius: 1
      }
    },

    plugins: {
      legend: { display: true },
    }
  };
  public lineChartType: ChartType = 'line';
  @ViewChild(BaseChartDirective) myLineChart !: BaseChartDirective;

  getCoinData() {
    this.api.getCurrencyById(this.coinId) //getcoinid from activatedRoute
      .subscribe(res => {
        if (this.currency === "USD") {
          res.market_data.current_price.inr = res.market_data.current_price.usd;
          res.market_data.market_cap.inr = res.market_data.market_cap.usd;
        }
        res.market_data.current_price.inr = res.market_data.current_price.inr;
        res.market_data.market_cap.inr = res.market_data.market_cap.inr;
        this.coinData = res;
      })
  }
}
