import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { UpdateEventDto } from './dto/update-event.dto';
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventType } from './enums/EventType.enum';
import { HttpModule } from '@nestjs/axios';

describe('EventController', () => {
  let app;

  const createEventDto = {
    id: 20,
    name: 'click-event',
    description:
      'when the user clicks the button the event should be triggered',
    type: 'app',
    priority: 0,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Event],
          autoLoadEntities: true,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Event]),
      ],
      controllers: [EventController],
      providers: [EventService],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('/event (POST) - Create a new event', async () => {
    const response = await request(app.getHttpServer())
      .post('/event')
      .send(createEventDto)
      .expect(HttpStatus.CREATED);

    expect(response.body).toHaveProperty('id');
  });

  it('/event (GET) - Retrieve a list of all events', async () => {
    const response = await request(app.getHttpServer())
      .get('/event')
      .expect(HttpStatus.OK);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/event/:id (GET) - Find an event by its ID', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/event')
      .send(createEventDto);

    const eventId = createResponse.body.id;

    const response = await request(app.getHttpServer())
      .get(`/event/${eventId}`)
      .expect(HttpStatus.OK);

    expect(response.body.id).toBe(eventId);
  });

  it('/event/:id (PATCH) - Update an existing event by its ID', async () => {
    // Create a new event and get its ID
    const createResponse = await request(app.getHttpServer())
      .post('/event')
      .send(createEventDto);

    const eventId = createResponse.body.id;

    const updateEventDto: UpdateEventDto = {
      type: EventType.CROSSPROMO,
    };

    const response = await request(app.getHttpServer())
      .patch(`/event/${eventId}`)
      .send(updateEventDto)
      .expect(HttpStatus.OK);

    expect(response.body.type).toBe(EventType.CROSSPROMO);
  });

  it('/event/:id (DELETE) - Remove an event by its ID', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/event')
      .send(createEventDto);

    const eventId = createResponse.body.id;

    await request(app.getHttpServer())
      .delete(`/event/${eventId}`)
      .expect(HttpStatus.OK);

    // Ensure that the event is deleted
    await request(app.getHttpServer())
      .get(`/event/${eventId}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  afterAll(async () => {
    await app.close();
  });
});
