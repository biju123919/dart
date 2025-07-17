import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-common-paginator',
  standalone: false,
  templateUrl: './common-paginator.component.html',

})
export class CommonPaginatorComponent implements OnInit, OnChanges {
  @Input() totalItems = 0;
  @Input() pageSizeOptions: number[] = [10, 25, 50, 100];
  @Output() pageChange = new EventEmitter<{ pageIndex: number; pageSize: number }>();

  currentPage: number = 1;
  pageSize: number = 10;

  ngOnInit(): void {
    if (this.pageSizeOptions && this.pageSizeOptions.length) {
      this.pageSize = this.pageSizeOptions[0];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pageSizeOptions'] && this.pageSizeOptions.length > 0) {
      if (!this.pageSizeOptions.includes(this.pageSize)) {
        this.pageSize = this.pageSizeOptions[0];
      }
    }

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize) || 1;
  }

  get startItem(): number {
    if (this.totalItems === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    if (this.totalItems === 0) return 0;
    const end = this.currentPage * this.pageSize;
    return Math.min(end, this.totalItems);
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.emitPageChange();
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.emitPageChange();
    }
  }

  onPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.emitPageChange();
    }
  }

  emitPageChange(): void {
    this.pageChange.emit({
      pageIndex: this.currentPage - 1,
      pageSize: this.pageSize,
    });
  }

  dropdownOpen = false;


  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    setTimeout(() => (this.dropdownOpen = false), 150);
  }

  selectPageSize(size: number): void {
    this.pageSize = size;
    this.dropdownOpen = false;
    this.onPageSizeChange();
  }
}