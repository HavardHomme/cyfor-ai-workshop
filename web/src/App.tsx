import { useState } from "react";
import {
  getGetItemsQueryKey,
  useDeleteItemsId,
  useGetItems,
  usePostItems,
  usePutItemsId,
} from "./api";
import { useQueryClient } from "@tanstack/react-query";

type EditState = {
  id: number;
  title: string;
  description: string;
  category: string;
};

export default function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<EditState | null>(null);
  const queryClient = useQueryClient();
  const searchParam = search.trim() || undefined;
  const refreshItems = () =>
    queryClient.invalidateQueries({ queryKey: getGetItemsQueryKey() });
  const itemsQuery = useGetItems({ search: searchParam });
  const createMutation = usePostItems({
    mutation: {
      onSuccess: async () => {
        setTitle("");
        setDescription("");
        setCategory("");
        await refreshItems();
      },
    },
  });
  const updateMutation = usePutItemsId({
    mutation: {
      onSuccess: async () => {
        setEditing(null);
        await refreshItems();
      },
    },
  });
  const deleteMutation = useDeleteItemsId({
    mutation: {
      onSuccess: refreshItems,
    },
  });

  const trimmedTitle = title.trim();
  const resources = itemsQuery.data?.items ?? [];
  const deletingId = deleteMutation.variables?.id;

  const handleCreate = (event: { preventDefault(): void }) => {
    event.preventDefault();
    if (!trimmedTitle || createMutation.isPending) return;
    createMutation.mutate({
      data: {
        title: trimmedTitle,
        description: description.trim() || undefined,
        category: category.trim() || undefined,
      },
    });
  };

  const handleEditSave = (event: { preventDefault(): void }) => {
    event.preventDefault();
    if (!editing || updateMutation.isPending) return;
    updateMutation.mutate({
      id: editing.id,
      data: {
        title: editing.title.trim(),
        description: editing.description.trim() || null,
        category: editing.category.trim() || undefined,
      },
    });
  };

  const startEdit = (resource: { id: number; title: string; description: string | null; category: string }) => {
    setEditing({
      id: resource.id,
      title: resource.title,
      description: resource.description ?? "",
      category: resource.category,
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">Resources</h1>
          <p className="text-sm text-slate-600">
            Manage bookable resources — add, edit, and remove them below.
          </p>
        </header>

        <form
          className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          onSubmit={handleCreate}
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Resource name"
            maxLength={120}
            className="rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-slate-500"
          />
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (e.g. Room, Equipment)"
            maxLength={60}
            className="rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-slate-500"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            maxLength={500}
            className="rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-slate-500"
          />
          <button
            type="submit"
            disabled={!trimmedTitle || createMutation.isPending}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {createMutation.isPending ? "Adding..." : "Add resource"}
          </button>
        </form>

        {createMutation.isError ? (
          <p className="text-sm text-rose-600">
            Could not add the resource: {createMutation.error.message}
          </p>
        ) : null}

        {deleteMutation.isError ? (
          <p className="text-sm text-rose-600">
            Could not remove the resource: {deleteMutation.error.message}
          </p>
        ) : null}

        {updateMutation.isError ? (
          <p className="text-sm text-rose-600">
            Could not update the resource: {updateMutation.error.message}
          </p>
        ) : null}

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium text-slate-700">All resources</h2>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="rounded-md border border-slate-300 px-3 py-1 text-sm outline-none focus:border-slate-500"
            />
          </div>

          {itemsQuery.isPending ? (
            <p className="mt-3 text-sm text-slate-600">Loading resources...</p>
          ) : null}

          {itemsQuery.isError ? (
            <p className="mt-3 text-sm text-rose-600">
              Could not load resources: {itemsQuery.error.message}
            </p>
          ) : null}

          {!itemsQuery.isPending && !itemsQuery.isError ? (
            resources.length > 0 ? (
              <ul className="mt-3 divide-y divide-slate-200">
                {resources.map((resource) =>
                  editing?.id === resource.id ? (
                    <li key={resource.id} className="py-3">
                      <form className="flex flex-col gap-2" onSubmit={handleEditSave}>
                        <input
                          value={editing.title}
                          onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                          maxLength={120}
                          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-slate-500"
                        />
                        <input
                          value={editing.category}
                          onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                          placeholder="Category"
                          maxLength={60}
                          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-slate-500"
                        />
                        <input
                          value={editing.description}
                          onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                          placeholder="Description (optional)"
                          maxLength={500}
                          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-slate-500"
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={!editing.title.trim() || updateMutation.isPending}
                            className="rounded-md bg-slate-900 px-3 py-1 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                          >
                            {updateMutation.isPending ? "Saving..." : "Save"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditing(null)}
                            className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </li>
                  ) : (
                    <li key={resource.id} className="flex items-start justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="font-medium">{resource.title}</p>
                        <p className="text-xs text-slate-500">{resource.category}</p>
                        {resource.description ? (
                          <p className="mt-0.5 text-sm text-slate-600">{resource.description}</p>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(resource)}
                          disabled={deleteMutation.isPending}
                          className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteMutation.mutate({ id: resource.id })}
                          disabled={deleteMutation.isPending}
                          className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                        >
                          {deleteMutation.isPending && deletingId === resource.id
                            ? "Removing..."
                            : "Remove"}
                        </button>
                      </div>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-600">No resources yet.</p>
            )
          ) : null}
        </section>
      </div>
    </main>
  );
}
