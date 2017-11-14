import { Component, ElementRef, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import * as io from "socket.io-client";
import { Observable } from 'rxjs/Observable';
@Component({    
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  January: number;
  February: number;
  March: number;
  April: number;
  May: number;
  June: number;
  logs = [];
  backGroundColor: string = 'rgba(77,83,6,0.2)';
  socket = io('https://socket-io-use.herokuapp.com/',
  {reconnect: true, transports : ['websocket']});

  constructor(myEl: ElementRef) { }

  public lineChartType: string = 'line';
  public labels = ['January', 'February', 'March', 'April', 'May', 'June'];
  public lineChartColor: Array<any> = [{ // dark grey
    backgroundColor: this.backGroundColor,
    borderColor: 'rgba(77,83,96,1)',
    pointBackgroundColor: 'rgba(77,83,96,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(77,83,96,1)'
  }
  ];

  public options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  ngOnInit(): void {
    this.socket.on('initRate', (data) => {
      this.January = data.jan;
      this.February = data.feb;
      this.March = data.mar;
      this.April = data.apr;
      this.May = data.may;
      this.June = data.jun;
      let newRate = [this.January, this.February, this.March, this.April, this.May, this.June];
      this.changeRate(newRate);
      this.socket.emit('signalz', 'received');
    });
    this.getRate().subscribe((newRateData) => this.changeRate(newRateData));
    this.getColor().subscribe((newColorData) => this.changeColor(newColorData));

   
  }

  public datasets = [
    {
      label: "Monthly Rate for 2016",
      data: [this.January, this.February, this.March, this.April, this.May, this.June]
    }
  ];


  getRate() {
    let observable = new Observable((observer) => {
      this.socket.on('new-rate', (newRate) => {
        observer.next(newRate.rate);
        this.logs.push((new Date).toLocaleTimeString() + ':   User <b>' +newRate.id + '</b> changed ' + newRate.month + ' rate to ' + newRate.value);
        this.scrollDown();
      });
    })
    return observable;
  }

  getColor(){
    let observable = new Observable((observer) => {
      this.socket.on('new-color', (data) => {
        observer.next(data.color);
        this.logs.push((new Date).toLocaleTimeString() + ':   User <b>' +data.id + '</b> changed chart background color to ' + data.color);
        this.scrollDown();
        
      });
    })
    return observable;
  }



  changeColor(newColorData) {
    let newColors = [
      {
        backgroundColor: newColorData,
        borderColor: 'rgba(77,83,96,1)',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)'
      }
    ]
    this.lineChartColor = newColors;
  }


  changeRate(newRate) {
    let newDataset = [
      {
        label: "Monthly Rate for 2016",
        data: newRate
      }
    ];
    this.datasets = newDataset;
  }

  scrollDown(){
    let element = document.getElementById("log-area");
    element.scrollTop = element.scrollHeight ;
  }



}
