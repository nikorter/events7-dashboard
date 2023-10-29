import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Ip,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  /**
   * Create a new event.
   * @param createEventDto - Data required to create the event.
   * @returns The created event.
   */
  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  /**
   * Retrieve a list of all events.
   * @returns An array of events.
   */
  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  /**
   * Find an event by its ID.
   * @param id - The ID of the event to retrieve.
   * @returns The event with the specified ID.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  /**
   * Update an existing event by its ID.
   * @param id - The ID of the event to update.
   * @param updateEventDto - Data containing the updates for the event.
   * @returns The updated event.
   */
  @Patch(':id')
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(+id, updateEventDto);
  }

  /**
   * Remove (delete) an event by its ID.
   * @param id - The ID of the event to remove.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }

  /**
   * Check if user on ip has permissions to create ads event
   * @returns True if use has permissions to create ads event
   */
  @Get('type/validation')
  typeValidation(@Ip() ip) {
    return this.eventService.typeValidation(ip);
  }
}
