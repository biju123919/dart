import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SaveModalComponent } from './save-modal.component';
import { ModalService } from '../../service/modal.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

const mockPromptName = 'Test Prompt';
const mockPromptText = 'For the report above, was intracranial hemorrhage reported? Respond only with (Positive or Negative).'
class MockModalService {
  getModalState = jasmine.createSpy('getModalState').and.returnValue(of({ data: { promptId: 1, promptName: mockPromptName, promptText: mockPromptText } }));
  closeModal = jasmine.createSpy('closeModal');
};

let dialogRefMock = {
  close: jasmine.createSpy()
};

let onSaveSpy = jasmine.createSpy('onSave');

describe('SaveModalComponent', () => {
  let component: SaveModalComponent;
  let fixture: ComponentFixture<SaveModalComponent>;
  let mockModalService: ModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaveModalComponent],
      imports: [FormsModule],
      providers: [
        { provide: ModalService, useClass: MockModalService },
        { provide: MatDialogRef, useValue: dialogRefMock },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { config: { onSave: onSaveSpy } }
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SaveModalComponent);
    mockModalService = TestBed.inject(ModalService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should initialize prompt name from modal state', () => {
    expect(component.promptName).toBe('Test Prompt');
  });

  it('should call onSave and closeModal when save() is called', () => {
    // Arrange
    component.promptName = 'Saved Prompt';

    // Act
    component.save();

    // Assert
    expect(onSaveSpy).toHaveBeenCalledWith('Saved Prompt');
    expect(mockModalService.closeModal).toHaveBeenCalled();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should call closeModal correctly', () => {
    //Act
    component.closeModal();

    //Assert
    expect(mockModalService.closeModal).toHaveBeenCalled();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });
});
