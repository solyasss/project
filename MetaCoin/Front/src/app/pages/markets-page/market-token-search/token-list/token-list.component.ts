import {Component, Input} from '@angular/core';
import {TokenComponent} from "../token/token.component";
import {NgForOf} from "@angular/common";

interface Token {
  icon: string;
  name: string;
  price: string;
}

@Component({
  selector: 'app-token-list',
  standalone: true,
  imports: [
    TokenComponent,
    NgForOf
  ],
  templateUrl: './token-list.component.html',
  styleUrl: './token-list.component.scss'
})
export class TokenListComponent {
  @Input() tokens: Token[] = [];
}
