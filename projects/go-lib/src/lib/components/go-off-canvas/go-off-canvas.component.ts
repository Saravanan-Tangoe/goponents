import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { GoOffCanvasDirective } from './go-off-canvas.directive';
import { GoOffCanvasService } from './go-off-canvas.service';
import { GoOffCanvasItem } from './go-off-canvas.interface';

import { fadeAnimation } from '../../animations/fade.animation';
import { offCanvasAnimation } from '../../animations/off-canvas.animation';

@Component({
  selector: 'go-off-canvas',
  templateUrl: './go-off-canvas.component.html',
  styleUrls: [
    './go-off-canvas.component.scss'
  ],
  animations: [
    fadeAnimation,
    offCanvasAnimation
  ]
})
export class GoOffCanvasComponent implements OnInit {
  currentOffCanvasItem: GoOffCanvasItem;
  opened: boolean = false;
  header: string;

  @ViewChild(GoOffCanvasDirective, { static: true }) goOffCanvasHost: GoOffCanvasDirective;
  size: 'large' | 'small' = 'small';

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private goOffCanvasService: GoOffCanvasService
  ) { }

  ngOnInit(): void {
    this.goOffCanvasService.activeOffCanvasComponent.subscribe((goOffCanvasItem: GoOffCanvasItem) => {
      this.currentOffCanvasItem = goOffCanvasItem;
      this.loadComponent();
    });

    this.goOffCanvasService.offCanvasOpen.subscribe((value: boolean) => {
      this.opened = value;
      if (this.opened === false) {
        this.destroyComponent();
      }
    });
  }

  closeOffCanvas(): void {
    this.goOffCanvasService.closeOffCanvas();
  }

  private loadComponent(): void {
    const componentFactory: ComponentFactory<any> = this.componentFactoryResolver.resolveComponentFactory(
      this.currentOffCanvasItem.component
    );
    const viewContainerRef: ViewContainerRef = this.goOffCanvasHost.viewContainerRef;
    const componentRef: ComponentRef<any> = viewContainerRef.createComponent(componentFactory);

    Object.keys(this.currentOffCanvasItem.bindings).forEach((key: string) => {
      componentRef.instance[key] = this.currentOffCanvasItem.bindings[key];
    });

    this.size = this.currentOffCanvasItem.size || 'small';
    this.header = this.currentOffCanvasItem.header;
  }

  private destroyComponent(): void {
    this.goOffCanvasHost.viewContainerRef.clear();
  }
}
