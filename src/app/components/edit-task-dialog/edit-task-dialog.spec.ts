import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTaskDialog } from './edit-task-dialog';

describe('EditTaskDialog', () => {
  let component: EditTaskDialog;
  let fixture: ComponentFixture<EditTaskDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTaskDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTaskDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
