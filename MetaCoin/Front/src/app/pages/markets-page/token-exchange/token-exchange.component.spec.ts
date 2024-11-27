import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenExchangeComponent } from './token-exchange.component';

describe('TokenExchangeComponent', () => {
  let component: TokenExchangeComponent;
  let fixture: ComponentFixture<TokenExchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenExchangeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TokenExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
