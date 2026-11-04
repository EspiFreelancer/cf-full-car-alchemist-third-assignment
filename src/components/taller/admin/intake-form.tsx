'use client'

import { useState, type FormEvent } from 'react'
import { CarFront } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useTaller } from '@/components/taller/taller-provider'
import type { NuevoIngreso } from '@/lib/taller/types'

const VACIO: NuevoIngreso = { nombre: '', telefono: '', patente: '', modelo: '', falla_inicial: '' }

export function IntakeForm({ onCreado }: { onCreado: (ordenId: string) => void }) {
  const { crearIngreso } = useTaller()
  const [datos, setDatos] = useState<NuevoIngreso>(VACIO)

  const set = (campo: keyof NuevoIngreso) => (valor: string) =>
    setDatos((prev) => ({ ...prev, [campo]: valor }))

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const limpio: NuevoIngreso = {
      nombre: datos.nombre.trim(),
      telefono: datos.telefono.trim(),
      patente: datos.patente.trim(),
      modelo: datos.modelo.trim(),
      falla_inicial: datos.falla_inicial.trim(),
    }
    if (Object.values(limpio).some((v) => v.length === 0)) return
    const id = crearIngreso(limpio)
    setDatos(VACIO)
    onCreado(id)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CarFront className="size-5" aria-hidden="true" />
          Nuevo ingreso
        </CardTitle>
        <CardDescription>Alta rápida de cliente y vehículo.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Campo id="nombre" label="Nombre del cliente">
            <Input
              id="nombre"
              required
              autoComplete="name"
              value={datos.nombre}
              onChange={(e) => set('nombre')(e.target.value)}
              className="h-11"
            />
          </Campo>
          <Campo id="telefono" label="Teléfono (WhatsApp)">
            <Input
              id="telefono"
              type="tel"
              required
              inputMode="tel"
              autoComplete="tel"
              placeholder="+54 9 11 1234-5678"
              pattern="[0-9+\-\s()]{8,20}"
              value={datos.telefono}
              onChange={(e) => set('telefono')(e.target.value)}
              className="h-11"
            />
          </Campo>
          <div className="grid grid-cols-2 gap-3">
            <Campo id="patente" label="Patente">
              <Input
                id="patente"
                required
                maxLength={10}
                placeholder="AB 123 CD"
                value={datos.patente}
                onChange={(e) => set('patente')(e.target.value.toUpperCase())}
                className="h-11 font-mono font-bold uppercase tracking-widest"
              />
            </Campo>
            <Campo id="modelo" label="Modelo">
              <Input
                id="modelo"
                required
                placeholder="Marca y modelo"
                value={datos.modelo}
                onChange={(e) => set('modelo')(e.target.value)}
                className="h-11"
              />
            </Campo>
          </div>
          <Campo id="falla" label="Falla inicial">
            <Textarea
              id="falla"
              required
              rows={3}
              maxLength={300}
              value={datos.falla_inicial}
              onChange={(e) => set('falla_inicial')(e.target.value)}
            />
          </Campo>
          <Button type="submit" className="h-12 text-base font-bold">
            Registrar ingreso
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function Campo({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}
