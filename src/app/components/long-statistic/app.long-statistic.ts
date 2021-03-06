import { Chart, registerables } from 'chart.js';
import './app.long-statistic.scss';
import LongStatistic from './app.long-statistic.html';
import { Component, Controller } from '../../../spa'
import { IAuth, IStatistics, IStatOptions } from '../../../spa/tools/controllerTypes';
import { ComponentEvent } from '../../../spa/core/coreTypes';

const LINE = 'line';
const BAR = 'bar';

class AppLongStatistic extends Component {
  private controller = new Controller();
  private labels: string[] = [];
  private chartLineData: number[] = [];
  private chartBarData: number[] = [];
  private currentChart = BAR;
  private chart: Chart;

  events = (): ComponentEvent[] =>  [{
    event: 'click',
    className: '.toggle-slider',
    listener: this.toggleSlider,
  }];

  toggleSlider(event: MouseEvent) {
    const target = <HTMLSpanElement>event.target;
    if (target.tagName === 'SPAN') {
      target.classList.toggle('on');
      this.currentChart = (this.currentChart === BAR) ? LINE : BAR;
      this.chart.destroy();
      this.showChart(this.currentChart);
    }
  }

  async getChartData() {
    const userInfo: IAuth = JSON.parse(localStorage.getItem('userInfo'));
    const statisticInfo: IStatistics =  await this.controller.getStatistics(userInfo.userId, userInfo.token);
    this.labels.length = 0;
    this.chartLineData.length = 0;
    this.chartBarData.length = 0;
    if (statisticInfo) {
      const statistic: IStatOptions[] = JSON.parse(statisticInfo.optional.stat);
      statistic.forEach((el) => {
        this.labels.push(el.date);
        this.chartBarData.push(el.newWords);
        this.chartLineData.push(el.totalWords);
      });
    } else {
      this.labels.push(new Date().toLocaleDateString());
      this.chartLineData[0] = 0;
      this.chartBarData[0] = 0;
    }
  }

  showChart(type: string) {
    Chart.register(...registerables);
    
    const ctx = <HTMLCanvasElement>document.getElementById('statisticChart');
    const opt = {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      }
    };
    if (type === LINE) {
      this.chart = new Chart(ctx, {
          type: LINE,
          data: {
            labels: this.labels,
            datasets: [{
              data: this.chartLineData,
              borderColor: 'rgb(254, 131, 102)',
              borderWidth: 1,
              tension: 0.1,
            }]
          },
          options: opt
      });
    } else {
      this.chart = new Chart(ctx, {
        type: BAR,
        data: {
          labels: this.labels,
          datasets: [{
            data: this.chartBarData,
            backgroundColor: 'rgba(254, 131, 102, 0.2)',
            borderColor: 'rgba(254, 131, 102)',
            borderWidth: 1,
          }]
        },
        options: opt
    });
    }
  }

  async afterInit() {
    if (localStorage.getItem('userInfo')) {
      await this.getChartData();
      this.showChart(this.currentChart);
    }
  }
}

export const appLongStatistic = new AppLongStatistic({
  selector: 'app-long-statistic',
  template: LongStatistic,
});