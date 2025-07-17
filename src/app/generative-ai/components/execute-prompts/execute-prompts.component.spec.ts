import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutePromptsComponent } from './execute-prompts.component';

describe('ExecutePromptsComponent', () => {
  let component: ExecutePromptsComponent;
  let fixture: ComponentFixture<ExecutePromptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExecutePromptsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutePromptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
