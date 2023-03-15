import { Tea } from '@app/models';
import { EMPTY } from 'rxjs';
import { TeaService } from './tea.service';

type TeaResponse = Omit<Tea, 'image' | 'rating'>;

export const createTeaServiceMock = () =>
  jasmine.createSpyObj<TeaService>('TeaService', {
    getAll: EMPTY,
    get: EMPTY,
    save: Promise.resolve(),
  });
