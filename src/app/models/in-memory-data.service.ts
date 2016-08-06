import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    let markets = [
      {id: 1, name: 'Summit MLS (Summit)'},
      {id: 2, name: 'Vail Multi-List Service (VMLS)'},
      {id: 3, name: 'Central Mississippi MLS (CMMLS)'},
      {id: 4, name: 'Northwest MLS (NWMLS)'},
      {id: 5, name: 'Greater McAllen Association of Realtors (GMAR)'},
      {id: 6, name: 'Knoxville Area Association of Realtors (KAARMLS)'},
      {id: 7, name: 'Coastal Carolina IDX Feed (CCARSC)'},
      {id: 8, name: 'Willamette Valley MLS (WVMLS)'},
      {id: 9, name: 'Coastal Association of REALTORS	Berlin, MD (CAR)'},
      {id: 10, name: 'MLS Property Information Network	(MLSPIN)'},
      {id: 11, name: 'Midwest Real Estate Data (MRED)'},
      {id: 12, name: 'Miami MLS (MIAMIRE)'},
      {id: 13, name: 'Greater Fort Lauderdale (R-World)'},
      {id: 14, name: 'San Diego Real Estate (SANDICOR)'},
      {id: 15, name: 'California Regional MLS (CRMLS)'}
    ];
    return {markets};
  }
}


	
	
	
	
	




