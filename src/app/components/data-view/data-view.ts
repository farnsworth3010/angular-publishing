import { ChangeDetectionStrategy, Component, inject, OnInit, Signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { DataTable } from "@app/shared/data-table/data-table";
import { AuthorsStore } from '@app/store/authors-store';
import { BooksStore } from '@app/store/books-store';
import { CategoriesStore } from '@app/store/categories-store';
import { MaterialsStore } from '@app/store/materials-store';
import { NewsStore } from '@app/store/news-store';
import { SalesStore } from '@app/store/sales-store';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faBook, faChartLine, faFileAlt, faNewspaper, faPenNib, faTags } from '@fortawesome/free-solid-svg-icons';
import { ProgressBar } from "primeng/progressbar";
import { SelectButton, SelectButtonChangeEvent } from "primeng/selectbutton";

@Component( {
  selector: 'pb-data-view',
  imports: [ SelectButton, FaIconComponent, DataTable, ReactiveFormsModule, ProgressBar, RouterOutlet, RouterLink ],
  templateUrl: './data-view.html',
  styleUrl: './data-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class DataView implements OnInit {
  #booksStore = inject( BooksStore );
  #authorsStore = inject( AuthorsStore );
  #categoriesStore = inject( CategoriesStore );
  #salesStore = inject( SalesStore );
  #materialsStore = inject( MaterialsStore );
  #newsStore = inject( NewsStore );
  #router = inject( Router );

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
        this.values = this.#categoriesStore.categories;
        this.cols = this.#categoriesStore.cols;
        this.loading = this.#categoriesStore.loading;
        this.#categoriesStore.get( {} );
      }
    },
    {
      id: 3,
      label: 'Sales', link: '/sales', icon: faChartLine, action: () => {
        this.values = this.#salesStore.sales;
        this.cols = this.#salesStore.cols;
        this.loading = this.#salesStore.loading;
        this.#salesStore.get( {} );
      }
    },
    {
      id: 4,
      label: 'Materials', link: '/materials', icon: faFileAlt, action: () => {
        this.values = this.#materialsStore.materials;
        this.cols = this.#materialsStore.cols;
        this.loading = this.#materialsStore.loading;
        this.#materialsStore.get( {} );
      }
    }
    ,
    {
      id: 5,
      label: 'News', link: '/news', icon: faNewspaper, action: () => {
        this.values = this.#newsStore.news;
        this.cols = this.#newsStore.cols;
        this.loading = this.#newsStore.loading;
        this.#newsStore.get( {} );
      }
    }
  ];

  protected itemControl = new FormControl<number>( this.items.find( item => item.link === this.#router.url )?.id || this.items[ 0 ].id );


  ngOnInit(): void {
    this.items[ this.itemControl.value || 0 ].action();
  }

  protected itemChanged( event: SelectButtonChangeEvent ): void {
    this.items[ event.value ].action();
    this.#router.navigateByUrl( this.items[ event.value ].link );
  }
}
