import { useMemo, useState } from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { servicesQuery, settingsQuery, TIME_SLOTS, whatsappLink, type Gender } from "@/lib/salon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionTitle } from "@/components/site/SectionTitle";

const searchSchema = z.object({
  gender: z.enum(["men", "women"]).optional(),
  service: z.string().optional(),
});

const bookingSchema = z.object({
  customer_name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Please enter a valid phone number"),
  gender: z.enum(["men", "women"]),
  service_ids: z.array(z.string().uuid()).min(1, "Please choose at least 1 service"),
  booking_date: z.string().min(1, "Please pick a date"),
  time_slot: z.string().min(1, "Please pick a time slot"),
  message: z.string().trim().max(500).optional(),
});

export const Route = createFileRoute("/book")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Book on WhatsApp — Divya Saroon" },
      {
        name: "description",
        content:
          "Choose multiple services, date and time, then send your appointment request to the salon on WhatsApp.",
      },
    ],
  }),
  component: BookPage,
});

const today = () => new Date().toISOString().slice(0, 10);

type BookingGender = Exclude<Gender, "unisex">;

function BookPage() {
  const search = useSearch({ from: "/book" });
  const { data: services = [] } = useQuery(servicesQuery);
  const { data: settings } = useQuery(settingsQuery);

  const [gender, setGender] = useState<BookingGender>(search.gender ?? "women");
  const [selectedIds, setSelectedIds] = useState<string[]>(search.service ? [search.service] : []);
  const [date, setDate] = useState(today());
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const options = useMemo(
    () => services.filter((s) => s.is_active && (s.gender === gender || s.gender === "unisex")),
    [services, gender],
  );

  function changeGender(value: BookingGender) {
    setGender(value);
    setSelectedIds([]);
  }

  function toggleService(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = bookingSchema.safeParse({
      customer_name: name,
      phone,
      gender,
      service_ids: selectedIds,
      booking_date: date,
      time_slot: slot,
      message: message || undefined,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }

    const target = settings?.whatsapp || settings?.phone;
    if (!target) {
      toast.error("WhatsApp number is not set up yet. Please call the salon.");
      return;
    }

    const selectedServices = services.filter((service) =>
      parsed.data.service_ids.includes(service.id),
    );
    const lines = [
      `Hello ${settings?.salon_name ?? "Divya Luxe Salon"}, I'd like to book an appointment.`,
      "",
      `Name: ${parsed.data.customer_name}`,
      `Phone: ${parsed.data.phone}`,
      `For: ${parsed.data.gender === "men" ? "Men" : "Women"}`,
      "Services:",
      ...selectedServices.map(
        (service, index) =>
          `${index + 1}. ${service.name}${service.offer_price != null ? ` — ₹${service.offer_price}` : service.price != null ? ` — ₹${service.price}` : ""}`,
      ),
      `Date: ${parsed.data.booking_date}`,
      `Preferred time: ${parsed.data.time_slot}`,
    ];
    if (parsed.data.message) lines.push(`Note: ${parsed.data.message}`);

    window.open(whatsappLink(target, lines.join("\n")), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-32 pb-20 text-center sm:px-6">
        <p className="text-primary text-[0.65rem] tracking-[0.45em] uppercase">WhatsApp opened</p>
        <h1 className="mt-5 text-4xl">Thank you, {name.split(" ")[0]}</h1>
        <p className="text-muted-foreground mt-4 text-sm">
          Your appointment details are ready in WhatsApp — just hit send and our team will confirm
          your slot there.
        </p>
        {settings?.phone ? (
          <p className="text-muted-foreground mt-6 text-sm">
            Need to change something? Call{" "}
            <a className="text-primary" href={`tel:${settings.phone}`}>
              {settings.phone}
            </a>
            .
          </p>
        ) : null}
        <Button className="mt-8" onClick={() => setSent(false)} variant="outline">
          Book another appointment
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pt-28 pb-16 sm:px-6">
      <SectionTitle
        eyebrow="Reservations"
        title="Book on WhatsApp"
        subtitle="Choose two or more services, your preferred date and time, then send everything to the salon in one WhatsApp message."
      />

      <form onSubmit={handleSubmit} className="card-luxe mt-12 space-y-6 rounded-2xl p-6 sm:p-8">
        <div className="space-y-2">
          <Label>Booking for</Label>
          <Select value={gender} onValueChange={(value) => changeGender(value as BookingGender)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="men">Men</SelectItem>
              <SelectItem value="women">Women</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <Label>Services</Label>
              <p className="text-muted-foreground mt-1 text-xs">
                Select one or more services. You can choose as many as you need. Only services for the selected audience are shown.
              </p>
            </div>
            <span className="text-primary text-xs font-medium">{selectedIds.length} selected</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {options.map((service) => {
              const selected = selectedIds.includes(service.id);
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => toggleService(service.id)}
                  aria-pressed={selected}
                  className={`rounded-xl border p-4 text-left transition-all ${selected ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-medium">{service.name}</span>
                    <span className="text-primary text-xs">{selected ? "Selected" : "Add"}</span>
                  </div>
                  <p className="text-muted-foreground mt-2 text-xs">
                    {service.offer_price != null
                      ? `₹${service.offer_price} offer`
                      : service.price != null
                        ? `₹${service.price}`
                        : "Price on request"}
                  </p>
                </button>
              );
            })}
          </div>
          {options.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No active services are available for this audience.
            </p>
          ) : null}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              min={today()}
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Time slot</Label>
            <Select value={slot} onValueChange={setSlot}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a slot" />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              value={name}
              maxLength={80}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={phone}
              maxLength={20}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+91 90000 00000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Notes (optional)</Label>
          <Textarea
            id="message"
            value={message}
            maxLength={500}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Preferred stylist, occasion, anything else…"
          />
        </div>

        <Button type="submit" size="lg" className="w-full">
          Book Appointment on WhatsApp
        </Button>
      </form>
    </div>
  );
}
