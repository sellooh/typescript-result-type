import { Test, TestingModule } from '@nestjs/testing';
import { ValidationError } from 'class-validator';
import { SaveFailedException } from './exceptions/save-failed-exception';
import { TryCatchDemoService } from './try-catch-demo.service';

describe('TryCatchService features', () => {
  let service: TryCatchDemoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TryCatchDemoService],
    }).compile();

    service = module.get<TryCatchDemoService>(TryCatchDemoService);
  });

  afterEach(() => {
    service.dummyDb = [...service.seedDb];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save', async () => {
    const entity = await service.save({
      name: 'new',
      age: 1,
    });
    expect(entity.name).toBe('new');
    expect(entity.age).toBe(1);
  });

  it('should get duplicated error on save', async () => {
    try {
      await service.save({
        name: 'duplicated',
        age: 1,
      });
      expect(true).toBe(false); // unreachable
    } catch (e) {
      expect(e).toBeInstanceOf(SaveFailedException);
      expect(e.message).toContain('Save failed');
      expect(e.message).toContain('duplicated');
    }
  });

  it('should get age input validation error', async () => {
    try {
      await service.save({
        name: 'invalid-input',
        age: -2,
      });
      expect(true).toBe(false); // unreachable
    } catch (e) {
      expect(e).toHaveLength(1);
      expect(e[0]).toBeInstanceOf(ValidationError);
      expect(e[0].property).toBe('age');
      expect(e[0].constraints.min).toBe('age must not be less than 1');
    }
  });

  // dealing with the error immediately
  it('should get duplicated error by saving twice', async () => {
    try {
      await service.save({
        name: 'equal',
        // name: 'duplicated',
        // how can we test this?
        age: 1,
      });
      await service.save({
        name: 'equal',
        age: 1,
      });
      expect(true).toBe(false); // unreachable
    } catch (e) {
      expect(e).toBeInstanceOf(SaveFailedException);
      expect(e.message).toContain('Save failed');
      expect(e.message).toContain('duplicated');
    }
  });

  // important logic, nested in `catch`
  it('should be able to save after deleting', async () => {
    try {
      await service.save({
        name: 'duplicated',
        age: 1,
      });
      expect(true).toBe(false); // unreachable
    } catch (e) {
      expect(e).toBeInstanceOf(SaveFailedException);
      expect(e.message).toContain('Save failed');
      expect(e.message).toContain('duplicated');

      // what happens if delete throws?
      const deleted = await service.delete('duplicated');
      expect(deleted).toBe(true);
      const entity = await service.save({
        name: 'duplicated',
        age: 1,
      });
      // how well this approach scales?
      // how readable is this?

      expect(entity.name).toBe('duplicated');
    }
  });
});
