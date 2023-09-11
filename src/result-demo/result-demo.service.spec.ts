import { Test, TestingModule } from '@nestjs/testing';
import { failure, success } from '../result/result';
import { EntityParser } from './entity.parser';
import { ParserValidationException } from './exceptions/parser-validation-exception';
import { SaveFailedException } from './exceptions/save-failed-exception';
import { ResultDemoService } from './result-demo.service';

describe('ResultDemoService features', () => {
  let service: ResultDemoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResultDemoService, EntityParser],
    }).compile();

    service = module.get<ResultDemoService>(ResultDemoService);
  });

  afterEach(() => {
    service.dummyDb = [...service.seedDb];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save', async () => {
    const result = await service.save({
      name: 'new',
      age: 1,
    });
    expect(result.status).toBe('success');
    const entity = result.expect('save failed');
    expect(entity.name).toBe('new');
    expect(entity.age).toBe(1);
  });

  it('should get duplicated error on save', async () => {
    const result = await service.save({
      name: 'duplicated',
      age: 1,
    });
    expect(result.status).toBe('failure');
    const e = failure.is(result) && result.reason;

    expect(e).toBeInstanceOf(SaveFailedException);
    expect(e.message).toContain('Save failed');
    expect(e.message).toContain('name "duplicated" is duplicated');
  });

  it('should get age input validation error', async () => {
    const result = await service.save({
      name: 'new',
      age: -2,
    });
    expect(result.status).toBe('failure');
    const e =
      failure.is(result) && (result.reason as ParserValidationException);

    expect(e).toBeInstanceOf(ParserValidationException);
    expect(e.validationErrors).toHaveLength(1);
    expect(e.validationErrors[0].property).toBe('age');
    expect(e.validationErrors[0].constraints.min).toBe(
      'age must not be less than 1',
    );
  });

  // dealing with the error when we choose to
  it('should get duplicated error by saving twice', async () => {
    const firstResult = await service.save({
      name: 'equal',
      // name: 'duplicated',
      // how can we test this?
      age: 1,
    });
    const secondResult = await service.save({
      name: 'equal',
      age: 1,
    });
    expect(success.is(firstResult)).toBe(true);
    expect(failure.is(secondResult)).toBe(true);

    const e = failure.is(secondResult) && secondResult.reason;

    expect(e).toBeInstanceOf(SaveFailedException);
    expect(e.message).toContain('Save failed');
    expect(e.message).toContain('name "equal" is duplicated');
  });

  // no more nesting, we can choose what to do with results
  it('should be able to save after deleting', async () => {
    const duplicatedResult = await service.save({
      name: 'duplicated',
      age: 1,
    });
    expect(duplicatedResult.status).toBe('failure');
    const e = failure.is(duplicatedResult) && duplicatedResult.reason;

    expect(e).toBeInstanceOf(SaveFailedException);
    expect(e.message).toContain('Save failed');
    expect(e.message).toContain('duplicated');

    const deleteResult = await service.delete('duplicated');
    expect(success.is(deleteResult)).toBe(true);

    const entityResult = await service.save({
      name: 'duplicated',
      age: 1,
    });
    expect(entityResult.status).toBe('success');
    const entity = entityResult.expect();

    // how well this approach scales?
    // how readable is this?

    expect(entity.name).toBe('duplicated');
  });
});
