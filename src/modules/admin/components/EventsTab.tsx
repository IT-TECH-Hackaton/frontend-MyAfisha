import { useGetCategoriesQuery } from "@modules/categories/api/hooks/useGetCategoriesQuery";
import { useDeleteEventMutation } from "@modules/events/api/hooks/useDeleteEventMutation";
import { useUpdateEventMutation } from "@modules/events/api/hooks/useUpdateEventMutation";
import { useEffect, useState } from "react";

import { useToast } from "@shared/lib/hooks/use-toast";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";

import { useGetAdminEventsQuery } from "../api/hooks/useGetAdminEventsQuery";
import type { AdminEventResponse } from "../api/requests/getAdminEvents";
import type { EventFormData } from "../types";
import { CreateEventDialog } from "./modals/CreateEventDialog";
import { EditEventModal } from "./modals/EditEventModal";
import { EventsTable } from "./tables/EventsTable";

export const EventsTab = () => {
  const { toast } = useToast();
  const [isEventModalOpen, setEventModalOpen] = useState(false);
  const [isEditEventModalOpen, setEditEventModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<AdminEventResponse | null>(null);
  const [eventForm, setEventForm] = useState<EventFormData>({
    title: "",
    shortDescription: "",
    fullDescription: "",
    startDate: "",
    endDate: "",
    maxParticipants: undefined,
    paymentInfo: "",
    address: "",
    status: "Активное",
    location: null
  });
  const [selectedEventCategories, setSelectedEventCategories] = useState<string[]>([]);
  const [eventStatusFilter, setEventStatusFilter] = useState<
    "Активное" | "Прошедшее" | "Отклоненное" | ""
  >("");

  const {
    data: eventsData,
    isLoading: isLoadingEvents,
    refetch: refetchEvents
  } = useGetAdminEventsQuery({
    params: { status: eventStatusFilter || undefined },
    options: { refetchOnWindowFocus: false }
  });

  const rawEvents = (eventsData as any)?.data ?? eventsData;
  const events = Array.isArray(rawEvents?.Data)
    ? rawEvents.Data
    : Array.isArray(rawEvents?.data)
      ? rawEvents.data
      : Array.isArray(rawEvents)
        ? rawEvents
        : [];

  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery({
    options: { refetchOnWindowFocus: false }
  });

  const categories = categoriesData?.data?.data || [];

  const updateEventMutation = useUpdateEventMutation({
    options: {
      onSuccess: () => {
        toast({ title: "Событие обновлено", description: "Изменения успешно сохранены" });
        refetchEvents();
        setEditEventModalOpen(false);
        setCurrentEvent(null);
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "Не удалось обновить событие";
        toast({
          className: "bg-red-800 text-white hover:bg-red-700",
          title: "Ошибка",
          description: errorMessage
        });
      }
    }
  });

  const deleteEventMutation = useDeleteEventMutation({
    options: {
      onSuccess: () => {
        toast({ title: "Событие удалено", description: "Событие успешно удалено из системы" });
        refetchEvents();
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "Не удалось удалить событие";
        toast({
          className: "bg-red-800 text-white hover:bg-red-700",
          title: "Ошибка",
          description: errorMessage
        });
      }
    }
  });

  useEffect(() => {
    if (currentEvent) {
      setSelectedEventCategories(currentEvent.categoryIDs || []);
    }
  }, [currentEvent]);

  const handleOpenEditEventModal = (event: AdminEventResponse) => {
    setCurrentEvent(event);
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    setEventForm({
      title: event.title,
      shortDescription: event.shortDescription || "",
      fullDescription: event.fullDescription || "",
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      maxParticipants: event.maxParticipants,
      paymentInfo: event.paymentInfo || "",
      address: "",
      status: event.status,
      location: null
    });
    setSelectedEventCategories(event.categoryIDs || []);
    setEditEventModalOpen(true);
  };

  const handleEventFormChange = (name: string, value: any) => {
    setEventForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEvent = () => {
    if (!currentEvent) return;

    if (eventForm.endDate && eventForm.startDate && eventForm.endDate < eventForm.startDate) {
      toast({
        className: "bg-red-800 text-white hover:bg-red-700",
        title: "Ошибка",
        description: "Дата окончания должна быть позже даты начала"
      });
      return;
    }

    const updateData: any = {
      title: eventForm.title || undefined,
      shortDescription: eventForm.shortDescription || undefined,
      fullDescription: eventForm.fullDescription || undefined,
      maxParticipants: eventForm.maxParticipants,
      paymentInfo: eventForm.paymentInfo || undefined,
      status: eventForm.status
    };

    if (eventForm.startDate) {
      const startDateTime = new Date(eventForm.startDate);
      startDateTime.setHours(12, 0, 0, 0);
      updateData.startDate = startDateTime.toISOString();
    }

    if (eventForm.endDate) {
      const endDateTime = new Date(eventForm.endDate);
      endDateTime.setHours(23, 59, 59, 999);
      updateData.endDate = endDateTime.toISOString();
    }

    if (eventForm.location) {
      updateData.latitude = eventForm.location.lat;
      updateData.longitude = eventForm.location.lon;
      updateData.address = eventForm.location.address;
    }

    if (selectedEventCategories.length > 0) {
      updateData.categoryIDs = selectedEventCategories;
    }

    updateEventMutation.mutate({
      params: {
        id: currentEvent.id,
        ...updateData
      }
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить событие?`)) {
      deleteEventMutation.mutate({ params: { id: eventId } });
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedEventCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-5'>
        <h1>Управление событиями</h1>
        <Button variant='default' onClick={() => setEventModalOpen(true)}>
          + Создать событие
        </Button>
      </div>
      <div className='bg-card text-card-foreground p-4 rounded-xl shadow-sm border border-border mb-5 flex gap-4 flex-wrap'>
        <Label className='flex items-center gap-2 cursor-pointer'>
          <Input
            type='radio'
            name='estatus'
            checked={eventStatusFilter === ""}
            onChange={() => setEventStatusFilter("")}
            className='cursor-pointer'
          />
          <span>Все</span>
        </Label>
        <Label className='flex items-center gap-2 cursor-pointer'>
          <Input
            type='radio'
            name='estatus'
            checked={eventStatusFilter === "Активное"}
            onChange={() => setEventStatusFilter("Активное")}
            className='cursor-pointer'
          />
          <span>Активные</span>
        </Label>
        <Label className='flex items-center gap-2 cursor-pointer'>
          <Input
            type='radio'
            name='estatus'
            checked={eventStatusFilter === "Прошедшее"}
            onChange={() => setEventStatusFilter("Прошедшее")}
            className='cursor-pointer'
          />
          <span>Прошедшие</span>
        </Label>
        <Label className='flex items-center gap-2 cursor-pointer'>
          <Input
            type='radio'
            name='estatus'
            checked={eventStatusFilter === "Отклоненное"}
            onChange={() => setEventStatusFilter("Отклоненное")}
            className='cursor-pointer'
          />
          <span>Отклоненные</span>
        </Label>
      </div>
      <div className='bg-card text-card-foreground rounded-xl shadow-sm overflow-hidden border border-border'>
        <table className='w-full border-collapse'>
          <thead>
            <tr>
              <th className='px-4 py-3 text-left border-b border-border bg-muted/70 font-semibold text-muted-foreground'>
                Название
              </th>
              <th className='px-4 py-3 text-left border-b border-border bg-muted/70 font-semibold text-muted-foreground'>
                Даты
              </th>
              <th className='px-4 py-3 text-left border-b border-border bg-muted/70 font-semibold text-muted-foreground'>
                Участники
              </th>
              <th className='px-4 py-3 text-left border-b border-border bg-muted/70 font-semibold text-muted-foreground'>
                Статус
              </th>
              <th className='px-4 py-3 text-right border-b border-border bg-muted/70 font-semibold text-muted-foreground'>
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            <EventsTable
              events={events}
              isLoading={isLoadingEvents}
              onEditEvent={handleOpenEditEventModal}
              onDeleteEvent={handleDeleteEvent}
              isDeleting={deleteEventMutation.isPending}
            />
          </tbody>
        </table>
      </div>

      <CreateEventDialog
        open={isEventModalOpen}
        onOpenChange={setEventModalOpen}
        onSuccess={() => {
          setEventModalOpen(false);
          refetchEvents();
        }}
      />

      {currentEvent && (
        <EditEventModal
          isOpen={isEditEventModalOpen}
          onClose={() => {
            setEditEventModalOpen(false);
            setCurrentEvent(null);
          }}
          event={currentEvent}
          formData={eventForm}
          onFormChange={handleEventFormChange}
          selectedCategories={selectedEventCategories}
          onCategoryToggle={handleCategoryToggle}
          categories={categories}
          isLoadingCategories={isLoadingCategories}
          onSave={handleSaveEvent}
          isSaving={updateEventMutation.isPending}
        />
      )}
    </div>
  );
};
