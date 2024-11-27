import {Component, Input, OnInit} from '@angular/core';
import {
  Chart,
  ChartConfiguration,
  ChartType,
  registerables
} from 'chart.js';
import {BaseChartDirective} from "ng2-charts";

// Регистрируем компоненты Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-trend-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './trend-chart.component.html',
  styleUrl: './trend-chart.component.scss'
})
export class TrendChartComponent {
  @Input() trendData: number[] = []; // Данные для графика
  @Input() isPositive: boolean = true; // Определяет цвет графика
  @Input() showLabels: boolean = true; // Определяет, показывать ли метки

  chartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: false,
    plugins: {
      legend: {display: false},
    },
    scales: {
      x: {type: 'category'},
      y: {beginAtZero: true},
    },
  };

  chartType: ChartType = 'line';

  ngOnInit(): void {
    console.log('Trend Data:', this.trendData); // Проверяем данные
    this.initializeChart();
  }

  initializeChart(): void {
    const labels = this.generateDateLabels(); // Генерируем метки-даты

    this.chartData = {
      labels,
      datasets: [
        {
          data: this.trendData,
          borderColor: this.isPositive ? 'rgba(0, 200, 0, 1)' : 'rgba(200, 0, 0, 1)',
          backgroundColor: this.isPositive ? 'rgba(0, 200, 0, 0.1)' : 'rgba(200, 0, 0, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4, // Скругленные линии
        },
      ],
    };

    this.chartOptions = {
      responsive: false,
      plugins: {
        legend: {display: false},
      },
      scales: {
        x: {
          type: 'category',
          display: this.showLabels, // Отображение оси X в зависимости от showLabels
          title: {display: this.showLabels, text: 'Date', color: '#fff'}, // Название оси X
        },
        y: {
          beginAtZero: false,
          display: this.showLabels, // Отображение оси Y в зависимости от showLabels
          title: {display: this.showLabels, text: 'Price', color: '#fff'}, // Название оси Y
        },
      },
    };
  }

  generateDateLabels(): string[] {
    const labels: string[] = [];
    const currentDate = new Date();

    for (let i = -3; i <= 3; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      labels.push(date.toLocaleDateString('en-GB')); // Формат даты: DD/MM/YYYY
    }

    return labels;
  }
}
