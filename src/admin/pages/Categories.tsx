import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminCategoriesApi, type CategoryFormValues } from '@/api/admin/categories'
import { useToast } from '@/context/ToastContext'
import { ApiError } from '@/lib/api'
import { Badge, Card, PageHeader, Table, Th, Td, EmptyRow, inputClass, labelClass } from '../components/ui'
import type { ApiCategory } from '@/types/api'

const EMPTY: CategoryFormValues = { name: '', description: '', status: 'active', sort_order: 0 }

function CategoryFormFields({
  values,
  onChange,
}: {
  values: CategoryFormValues
  onChange: (values: CategoryFormValues) => void
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      <div className="sm:col-span-2">
        <label className={labelClass}>Name</label>
        <input value={values.name} onChange={(e) => onChange({ ...values, name: e.target.value })} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Sort Order</label>
        <input
          type="number"
          value={values.sort_order ?? 0}
          onChange={(e) => onChange({ ...values, sort_order: Number(e.target.value) })}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Status</label>
        <select value={values.status} onChange={(e) => onChange({ ...values, status: e.target.value as 'active' | 'inactive' })} className={inputClass}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="sm:col-span-4">
        <label className={labelClass}>Description</label>
        <input
          value={values.description ?? ''}
          onChange={(e) => onChange({ ...values, description: e.target.value })}
          className={inputClass}
        />
      </div>
    </div>
  )
}

export default function Categories() {
  const { push } = useToast()
  const queryClient = useQueryClient()
  const { data: categories = [], isLoading } = useQuery({ queryKey: ['admin', 'categories'], queryFn: adminCategoriesApi.list })

  const [creating, setCreating] = useState<CategoryFormValues>(EMPTY)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editing, setEditing] = useState<CategoryFormValues>(EMPTY)
  const [saving, setSaving] = useState(false)

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] })
  }

  async function onCreate() {
    if (!creating.name.trim()) return
    setSaving(true)
    try {
      await adminCategoriesApi.create(creating)
      setCreating(EMPTY)
      invalidate()
      push('Category created.', 'success')
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Could not create category.', 'error')
    } finally {
      setSaving(false)
    }
  }

  function startEdit(category: ApiCategory) {
    setEditingId(category.id)
    setEditing({
      name: category.name,
      description: category.description ?? '',
      status: category.status,
      sort_order: category.sort_order,
    })
  }

  async function onSaveEdit() {
    if (editingId === null) return
    setSaving(true)
    try {
      await adminCategoriesApi.update(editingId, editing)
      setEditingId(null)
      invalidate()
      push('Category updated.', 'success')
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Could not update category.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(category: ApiCategory) {
    if (!window.confirm(`Delete "${category.name}"?`)) return
    try {
      await adminCategoriesApi.delete(category.id)
      invalidate()
      push('Category deleted.', 'success')
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Could not delete category.', 'error')
    }
  }

  return (
    <div>
      <PageHeader title="Categories" />

      <Card className="mb-6 p-5">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-cocoa-500">New Category</p>
        <CategoryFormFields values={creating} onChange={setCreating} />
        <button
          type="button"
          onClick={onCreate}
          disabled={saving}
          className="mt-4 rounded-md bg-cocoa-900 px-5 py-2 font-display text-xs font-bold uppercase tracking-wide text-cream-100 hover:opacity-90 disabled:opacity-60"
        >
          Add Category
        </button>
      </Card>

      <Card className="p-4">
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Products</Th>
              <Th>Status</Th>
              <Th className="text-right">Sort</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <EmptyRow colSpan={5}>Loading…</EmptyRow>
            ) : categories.length === 0 ? (
              <EmptyRow colSpan={5}>No categories yet.</EmptyRow>
            ) : (
              categories.map((category) =>
                editingId === category.id ? (
                  <tr key={category.id}>
                    <td colSpan={5} className="border-b border-cocoa-900/8 px-4 py-4">
                      <CategoryFormFields values={editing} onChange={setEditing} />
                      <div className="mt-3 flex gap-2">
                        <button type="button" onClick={onSaveEdit} disabled={saving} className="rounded-md bg-cocoa-900 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-cream-100">
                          Save
                        </button>
                        <button type="button" onClick={() => setEditingId(null)} className="rounded-md border border-cocoa-900/18 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-cocoa-700">
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={category.id}>
                    <Td className="font-bold text-cocoa-900">{category.name}</Td>
                    <Td>{category.products_count ?? 0}</Td>
                    <Td>
                      <Badge tone={category.status === 'active' ? 'success' : 'neutral'}>{category.status}</Badge>
                    </Td>
                    <Td className="text-right">{category.sort_order}</Td>
                    <Td>
                      <div className="flex justify-end gap-3 text-xs font-bold uppercase tracking-wide">
                        <button type="button" onClick={() => startEdit(category)} className="text-cocoa-700 hover:text-blush-600">
                          Edit
                        </button>
                        <button type="button" onClick={() => onDelete(category)} className="text-blush-600 hover:text-blush-700">
                          Delete
                        </button>
                      </div>
                    </Td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  )
}
