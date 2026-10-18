import { Component, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FdaService } from '../fda/fda.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { HistoryCardComponent } from '../history.card/history.card.component';
import {
	IonSearchbar,
	IonToolbar,
	IonButton,
	IonIcon,
	IonInput,
	IonSelect,
	IonSelectOption
} from '@ionic/angular';

@Component({
	selector: 'app-history.home',
	templateUrl: './history.home.page.html',
	styleUrls: ['./history.home.page.scss'],
	imports: [
		CommonModule,
		FormsModule,
		HistoryCardComponent,
		IonSearchbar,
		IonToolbar,
		IonButton,
		IonIcon,
		IonInput,
		IonSelect,
		IonSelectOption
	]
})
export class HistoryHomePage {
	fdaService = inject(FdaService);
	@ViewChild('sortSelect', { static: false }) sortSelect!: IonSelect;
	selectedSort = signal('az');
	searchFilter = signal('');

	openSelect() {
		this.sortSelect.open();
	}

	sortAZ(a: any, b: any) {
		return a.localeCompare(b);
	}

	sortZA(a: any, b: any) {
		return b.localeCompare(a);
	}

	sortNewest(a: any, b: any) {
		if (b.seconds !== a.seconds) {
			return b.seconds - a.seconds;
		}
		return b.nanoseconds - a.nanoseconds;
	}

	sortOldest(a: any, b: any) {
		if (a.seconds !== b.seconds) {
			return a.seconds - b.seconds;
		}
		return a.nanoseconds - b.nanoseconds;
	}

	async fetchHistory(searchFilter: string, selectedSort: string) {
		const items = await this.fdaService.get();

		console.log(searchFilter);
		console.log(selectedSort);
		console.log('items', items);

		return items
			.sort((a: any, b: any) => {
				switch (selectedSort) {
					case 'az':
						return this.sortAZ(a?.search_key, b?.search_key);
					case 'za':
						return this.sortZA(a?.search_key, b?.search_key);
					case 'newest':
						return this.sortNewest(a?.createdAt, b?.createdAt);
					case 'oldest':
						return this.sortOldest(a?.createdAt, b?.createdAt);
				}
			})
			.filter((item: any) => {
				if (searchFilter === '') {
					return true;
				}
				return item?.search_key?.toLowerCase()?.search(searchFilter) >= 0;
			});
	}

	readonly fdaQuery = injectQuery(() => ({
		queryFn: () => this.fetchHistory(this.searchFilter(), this.selectedSort()),
		queryKey: ['items', this.searchFilter(), this.selectedSort()]
	}));
}
