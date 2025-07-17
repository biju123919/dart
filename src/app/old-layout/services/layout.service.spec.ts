import { TestBed } from '@angular/core/testing';

import { LayoutService } from './layout.service';
import { DART_LOGO_TEXT } from '../../constants/global.constants';

describe('LayoutService', () => {
  let layoutService: LayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    layoutService = TestBed.inject(LayoutService);
  });

  it('should be created', () => {
    expect(layoutService).toBeTruthy();
  });

  it('should initialize with default LOGO_TEXT title', (done) => {
    // Act
    layoutService.title$.subscribe(title => {
      // Assert
      expect(title).toBe(DART_LOGO_TEXT);
      done();
    });
  });

  it('should initialize with null userEmail', (done) => {
    // Act
    layoutService.userEmail$.subscribe(email => {

      // Assert
      expect(email).toBeNull();
      done();
    });
  });

  it('should update title when setTitle is called', (done) => {
    // Arrange
    const newTitle = 'New Title';

    // Assert
    layoutService.title$.subscribe(title => {
      if (title === newTitle) {
        expect(title).toBe(newTitle);
        done();
      }
    });

    // Act
    layoutService.setTitle(newTitle);
  });

  it('should update userEmail when setUserEmail is called', (done) => {
    // Arrange
    const email = 'test@example.com';

    // Assert
    layoutService.userEmail$.subscribe(emailValue => {
      if (emailValue === email) {
        expect(emailValue).toBe(email);
        done();
      }
    });

    // Act
    layoutService.setUserEmail(email);
  });
});
