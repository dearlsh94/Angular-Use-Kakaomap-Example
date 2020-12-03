import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KakaomapComponent } from './kakaomap.component';

describe('KakaomapComponent', () => {
  let component: KakaomapComponent;
  let fixture: ComponentFixture<KakaomapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KakaomapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KakaomapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
