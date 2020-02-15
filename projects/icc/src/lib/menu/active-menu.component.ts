import { Component, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatMenuTrigger } from '@angular/material/menu';
import { IccMenuItem } from './menu-item';

@Component({
  selector: 'icc-active-menu',
  templateUrl: 'active-menu.component.html',
  styleUrls: ['./active-menu.component.scss']
})
export class IccActiveMenuComponent {
  @Input() menuItem: IccMenuItem;
  @Input() conflictEvent: boolean;

  @Output() iccMenuOptionClickEvent: EventEmitter<IccMenuItem> = new EventEmitter();

  enteredButton = false;
  isMatMenuOpen = false;
  isMatMenu2Open = false;
  prevButtonTrigger: MatMenuTrigger;

  trackMouseMove: () => void;

  constructor(private renderer: Renderer2) { }

  menuOptionClick(event, option: IccMenuItem) {
    event.stopPropagation();
    if (!option.disabled) {
      this.iccMenuOptionClickEvent.emit(option);
    }
  }

  // check box click may not emit correct event while use checkBoxChange is consistent
  checkBoxChange(event, option: IccMenuItem) {
    if (!option.disabled) {
      this.iccMenuOptionClickEvent.emit(option);
    }
  }

  buttonEnter(trigger: MatMenuTrigger, button: MatButton, event) {
    setTimeout(() => {
      if (this.prevButtonTrigger && this.prevButtonTrigger !== trigger) {
        this.closeMenu(this.prevButtonTrigger, button);
        this.prevButtonTrigger = trigger;
        this.isMatMenuOpen = false;
        this.isMatMenu2Open = false;
        this.openMenu(trigger, button, event);
      } else if (!this.isMatMenuOpen) {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger;
        this.openMenu(trigger, button, event);
      } else {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger;
      }
    });
  }

  buttonLeave(trigger: MatMenuTrigger, button: MatButton) {
    setTimeout(() => {
      if (this.enteredButton && !this.isMatMenuOpen) {
        this.closeMenu(trigger, button);
      } else if (!this.isMatMenuOpen) {
        this.closeMenu(trigger, button);
      } else {
        this.enteredButton = false;
      }
    }, 100);
  }

  openMenu(trigger: MatMenuTrigger, button: MatButton, event) {
    /*
    if (this.trackMouseMove) {
      this.trackMouseMove();
    }
    if (this.conflictEvent) {
      return;
    }
    trigger.openMenu();
    const Rect = event.target.getBoundingClientRect();
    // when change icon to css icon, the target button height becomes zero, need min height to compare
    const bottom = (Rect.height === 0) ? Rect.bottom + 32 : Rect.bottom;
    this.trackMouseMove = this.renderer.listen('document', 'mousemove', (e) => {
      const x = e.clientX;
      const y = e.clientY;
      if (x < Rect.left || x > Rect.right || y < Rect.top || y > bottom) {
        this.buttonLeave(trigger, button);
      }
    }); */
  }

  closeMenu(trigger: MatMenuTrigger, button: MatButton) {
    this.enteredButton = false;
    this.trackMouseMove();
    trigger.closeMenu();
    this.renderer.removeClass(button._elementRef.nativeElement, 'cdk-focused');
    this.renderer.removeClass(button._elementRef.nativeElement, 'cdk-program-focused');

    // this.renderer.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
    // this.renderer.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
  }

  menuenter() {
    this.isMatMenuOpen = true;
    if (this.isMatMenu2Open) {
      this.isMatMenu2Open = false;
    }
  }

  menuLeave(trigger: MatMenuTrigger, button: MatButton) {
    setTimeout(() => {
      if (!this.isMatMenu2Open && !this.enteredButton) {
        this.isMatMenuOpen = false;
        this.closeMenu(trigger, button);
      } else {
        this.isMatMenuOpen = false;
      }
    }, 80);
  }

  // level 2 ie not suppoted and code is not tested
  menu2enter() {
    this.isMatMenu2Open = true;
  }

  menu2Leave(trigger1: MatMenuTrigger, trigger2: MatMenuTrigger, button: MatButton) {
    setTimeout(() => {
      if (this.isMatMenu2Open) {
        this.isMatMenuOpen = false;
        this.isMatMenu2Open = false;
        this.enteredButton = false;
        this.closeMenu(trigger1, button);
      } else {
        this.isMatMenu2Open = false;
        this.closeMenu(trigger2, button);
      }
    }, 100);
  }

  /*
  menuenter() {
    this.isMatMenuOpen = true;
    if (this.isMatMenu2Open) {
      this.isMatMenu2Open = false;
    }
  }

  menuLeave(trigger: MatMenuTrigger, button: MatButton) {
    setTimeout(() => {
      if (!this.isMatMenu2Open && !this.enteredButton) {
        this.isMatMenuOpen = false;
        trigger.closeMenu();
        this.buttonRemoveClass(button);
      } else {
        this.isMatMenuOpen = false;
      }
    }, 80);
  }

  menu2enter() {
    this.isMatMenu2Open = true;
  }

  menu2Leave(trigger1: MatMenuTrigger, trigger2: MatMenuTrigger, button: MatButton) {
    setTimeout(() => {
      if (this.isMatMenu2Open) {
        trigger1.closeMenu();
        this.isMatMenuOpen = false;
        this.isMatMenu2Open = false;
        this.enteredButton = false;
        this.buttonRemoveClass(button);
      } else {
        this.isMatMenu2Open = false;
        trigger2.closeMenu();
      }
    }, 100);
  }

  buttonEnter(trigger: MatMenuTrigger) {
    setTimeout(() => {
      if (this.prevButtonTrigger && this.prevButtonTrigger !== trigger) {
        this.prevButtonTrigger.closeMenu();
        this.prevButtonTrigger = trigger;
        this.isMatMenuOpen = false;
        this.isMatMenu2Open = false;
        trigger.openMenu();
      } else if (!this.isMatMenuOpen) {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger;
        trigger.openMenu();
      } else {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger;
      }
    });
  }

  buttonLeave(trigger: MatMenuTrigger, button: MatButton) {
    setTimeout(() => {
      if (this.enteredButton && !this.isMatMenuOpen) {
        trigger.closeMenu();
        this.buttonRemoveClass(button);
      } if (!this.isMatMenuOpen) {
        trigger.closeMenu();
        this.buttonRemoveClass(button);
      } else {
        this.enteredButton = false;
      }
    }, 100);
  }

  private buttonRemoveClass(button: MatButton) {
    this.renderer.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
    this.renderer.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
  } */
}
