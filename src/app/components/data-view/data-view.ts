import { ChangeDetectionStrategy, Component, inject, OnInit, Signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DataTable } from "@app/shared/data-table/data-table";
import { AuthorsStore } from '@app/store/authors-store';
import { BooksStore } from '@app/store/books-store';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faBook, faChartLine, faFileAlt, faPenNib, faTags } from '@fortawesome/free-solid-svg-icons';
import { ProgressBar } from "primeng/progressbar";
import { SelectButton, SelectButtonChangeEvent } from "primeng/selectbutton";

@Component( {
  selector: 'pb-data-view',
  imports: [ SelectButton, FaIconComponent, DataTable, ReactiveFormsModule, ProgressBar ],
  templateUrl: './data-view.html',
  styleUrl: './data-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class DataView implements OnInit {
  #booksStore = inject( BooksStore );
  #authorsStore = inject( AuthorsStore );

  protected values: Signal<any[]> = this.#booksStore.books;
  protected cols: Signal<any[]> = this.#booksStore.cols;
  protected loading: Signal<boolean> = this.#booksStore.loading;

  protected readonly items = [
    {
      id: 0,
      label: 'Books', link: '/books', icon: faBook, action: () => {
        this.values = this.#booksStore.books;
        this.cols = this.#booksStore.cols;
        this.loading = this.#booksStore.loading;
        this.#booksStore.get( {} );
      }
    },
    {
      id: 1,
      label: 'Authors', link: '/authors', icon: faPenNib, action: () => {
        this.values = this.#authorsStore.authors;
        this.cols = this.#authorsStore.cols;
        this.loading = this.#authorsStore.loading;
        this.#authorsStore.get( {} );
      }
    },
    {
      id: 2,
      label: 'Categories', link: '/categories', icon: faTags, action: () => {

      }
    },
    {
      id: 3,
      label: 'Sales', link: '/sales', icon: faChartLine, action: () => {

      }
    },
    {
      id: 4,
      label: 'Materials', link: '/materials', icon: faFileAlt, action: () => {
      }
    }
  ];

  protected itemControl = new FormControl<number>( this.items[ 0 ].id );


  ngOnInit(): void {
    this.#booksStore.get( {} );
  }

  protected itemChanged( event: SelectButtonChangeEvent ): void {
    this.items[ event.value ].action();
  }
}
