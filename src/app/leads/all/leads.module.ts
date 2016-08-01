import { NgModule }                 from '@angular/core';
import { FormsModule }              from '@angular/forms';
import { CommonModule }             from '@angular/common';
import { DatePipe }                 from '@angular/common';
import { LeadsComponent }           from './leads.component';
import { LeadsRoutingModule }       from './leads-routing.module';
import { Ng2TableModule }           from 'ng2-table/ng2-table';
import { PaginationModule }         from 'ng2-bootstrap/pagination';
import { Ng2Bs3ModalModule }        from 'ng2-bs3-modal/ng2-bs3-modal';
import { RealtorTableComponent }    from '../../shared/realtor-table/realtor-table.component';
import { RealtorService }           from '../../shared/realtorService';

@NgModule({
    imports: [
        LeadsRoutingModule,
        FormsModule,
        CommonModule,
        Ng2TableModule,
        PaginationModule.forRoot(),
        Ng2Bs3ModalModule,
    ],
    declarations: [ 
        LeadsComponent,
        RealtorTableComponent
    ],
    exports: [
        RealtorTableComponent
    ],
    providers: [DatePipe]
})
export class LeadsModule { }