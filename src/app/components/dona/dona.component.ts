import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartEvent, ChartType } from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent implements OnInit{
  @Input() title: string = 'Sin título';
  // Doughnut
  @Input('labels') doughnutChartLabels: string[] = ['Label 1', 'Label2', 'Label3'];
  @Input('data') data: number[] = [350, 450, 100];
  
  doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: this.data,
        backgroundColor: [ '#6857E6', '#009FEE', '#F02059' ]
      }
    ]
  };

  public ngOnInit(): void {
    this.doughnutChartData.datasets[0].data = (this.data.length === 0)? [350, 450, 100] : this.data;
    this.doughnutChartData.labels = (this.doughnutChartLabels.length === 0)? ['Label 1', 'Label2', 'Label3'] : this.doughnutChartLabels;  
  }

  doughnutChartType: ChartType = 'doughnut';

  // events
  public chartClicked({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }
}
