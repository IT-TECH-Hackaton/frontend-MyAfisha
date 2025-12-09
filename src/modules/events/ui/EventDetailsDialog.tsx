import { CalendarRange, MapPin, ShieldAlert, Users, Wallet, CircleCheck } from "lucide-react";

import { formatEventDateRange, getStatusLabel } from "@modules/events/lib/events-data";
import type { Event } from "@modules/events/types/event";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@shared/ui/dialog";
import { Button } from "@shared/ui/button";

const statusTone = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  past: "bg-slate-50 text-slate-600 border-slate-200",
  declined: "bg-destructive/10 text-destructive border-destructive/40"
} as const;

interface EventDetailsDialogProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  onCancelRequest: (id: string) => void;
}

export const EventDetailsDialog = ({
  event,
  open,
  onClose,
  onConfirm,
  onCancelRequest
}: EventDetailsDialogProps) => {
  if (!event) return null;

  const isFull = event.participantsLimit !== undefined && event.participantsCount >= event.participantsLimit;
  const userStatusText = event.userParticipating ? "Вы участвуете" : "Вы не участвуете";

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? undefined : onClose())}>
      <DialogContent className='max-h-[90vh] overflow-y-auto'>
        <DialogHeader className='gap-2'>
          <DialogTitle className='flex items-center gap-3 text-2xl'>
            <span className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <CircleCheck className='h-5 w-5' />
            </span>
            {event.title}
          </DialogTitle>
          <DialogDescription>{event.shortDescription}</DialogDescription>
          <div
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${statusTone[event.status]}`}
          >
            <span className='h-2 w-2 rounded-full bg-current opacity-70' />
            {getStatusLabel(event.status)}
          </div>
        </DialogHeader>

        <div className='overflow-hidden rounded-lg border'>
          <img src={event.imageUrl || "/placeholder.svg"} alt={event.title} className='h-64 w-full object-cover' />
        </div>

        <div className='grid gap-4 rounded-lg border p-4 md:grid-cols-2'>
          <div className='space-y-2 text-sm text-muted-foreground'>
            <div className='flex items-start gap-2'>
              <CalendarRange className='mt-0.5 h-4 w-4 text-foreground' />
              <div>
                <p className='font-medium text-foreground'>Даты проведения</p>
                <p>{formatEventDateRange(event.startDate, event.endDate)}</p>
              </div>
            </div>
            <div className='flex items-start gap-2'>
              <Users className='mt-0.5 h-4 w-4 text-foreground' />
              <div>
                <p className='font-medium text-foreground'>Участники</p>
                <p>
                  {event.participantsCount}
                  {event.participantsLimit ? ` / ${event.participantsLimit}` : ""} человек
                </p>
                {isFull && <p className='text-amber-600'>Достигнут максимальный лимит участников</p>}
              </div>
            </div>
            {event.paymentInfo && (
              <div className='flex items-start gap-2'>
                <Wallet className='mt-0.5 h-4 w-4 text-foreground' />
                <div>
                  <p className='font-medium text-foreground'>Оплата</p>
                  <p>{event.paymentInfo}</p>
                </div>
              </div>
            )}
            {event.location && (
              <div className='flex items-start gap-2'>
                <MapPin className='mt-0.5 h-4 w-4 text-foreground' />
                <div>
                  <p className='font-medium text-foreground'>Место</p>
                  <p>{event.location}</p>
                </div>
              </div>
            )}
          </div>

          <div className='rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground'>
            <p className='mb-2 font-medium text-foreground'>Описание</p>
            <p className='leading-relaxed text-foreground'>{event.description}</p>
          </div>
        </div>

        <div className='rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground'>
          <p className='font-medium text-foreground'>Статус участия</p>
          <p className='text-foreground'>{userStatusText}</p>
          {event.status === "declined" && (
            <div className='mt-2 inline-flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive'>
              <ShieldAlert className='h-4 w-4' />
              Событие отклонено — отображается только администраторам
            </div>
          )}
        </div>

        <DialogFooter className='flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='text-sm text-muted-foreground'>
            {event.status === "past"
              ? "Событие завершено — можно посмотреть итоги"
              : isFull && !event.userParticipating
                ? "Свободных мест нет, участие недоступно"
                : "Вы можете подтвердить или отменить участие"}
          </div>

          <div className='flex w-full flex-col gap-2 sm:w-auto sm:flex-row'>
            {event.userParticipating && (
              <Button variant='outline' onClick={() => onCancelRequest(event.id)}>
                Отменить участие
              </Button>
            )}
            {!event.userParticipating && event.status === "active" && (
              <Button onClick={() => onConfirm(event.id)} disabled={isFull}>
                Подтвердить участие
              </Button>
            )}
            {event.status === "past" && (
              <Button variant='ghost' disabled>
                Событие прошло
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

