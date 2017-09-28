import { Component, Input } from '@angular/core'

@Component({
	selector: 'music-modal',
	template: `
		<div id="shareModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<ng-content select="[header]"></ng-content>
					</div>
					<div class="modal-body">
						<ng-content select="[body]"></ng-content>
					</div>
					<div class="modal-footer">
						<ng-content select="[footer]"></ng-content>
					</div>
				</div>
			</div>
		</div>`, 
	styles : [`
	`]
})
export class MusicModal {
	@Input() modalId: string
}