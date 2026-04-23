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
    <div className="min-h-screen flex flex-col bg-[#F5F2EC] text-[#1A1A14]">

      {/* ── Top header bar ─────────────────────────────────────────── */}
      <header className="bg-[#253722] px-6 py-3 flex items-center gap-4 shadow-md">
        <img
          src="/forsvaret-logo-hvit.png"
          alt="Forsvaret"
          className="h-10 w-auto"
        />
        <div className="ml-4 border-l border-[#3A5C34] pl-4">
          <p className="text-white text-xs tracking-widest uppercase font-medium leading-none opacity-70">
            Ressursforvaltning
          </p>
          <p className="text-white text-sm tracking-wide font-medium leading-tight mt-0.5">
            Cyfor — Ressursbooking
          </p>
        </div>
      </header>

      {/* ── Page content ───────────────────────────────────────────── */}
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-xl space-y-6">

          {/* Page title */}
          <div className="border-l-4 border-[#253722] pl-4 space-y-1">
            <h1 className="text-2xl font-bold tracking-wide uppercase text-[#0D1F0D]">
              Ressurser
            </h1>
            <p className="text-sm text-[#5A5A4A]">
              Administrer bookbare ressurser — legg til, rediger og fjern dem nedenfor.
            </p>
          </div>

          {/* ── Add resource form ─────────────────────────────────── */}
          <form
            className="flex flex-col gap-3 border border-[#DDD8CC] bg-white p-5 shadow-sm"
            onSubmit={handleCreate}
          >
            <p className="text-xs font-medium tracking-widest uppercase text-[#5A5A4A] pb-1 border-b border-[#DDD8CC]">
              Ny ressurs
            </p>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ressursnavn"
              maxLength={120}
              className="border border-[#DDD8CC] bg-[#F5F2EC] px-3 py-2 text-base outline-none focus:border-[#253722] focus:bg-white transition-colors placeholder:text-[#9A9A8A]"
            />
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Kategori (f.eks. Rom, Utstyr)"
              maxLength={60}
              className="border border-[#DDD8CC] bg-[#F5F2EC] px-3 py-2 text-base outline-none focus:border-[#253722] focus:bg-white transition-colors placeholder:text-[#9A9A8A]"
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beskrivelse (valgfritt)"
              maxLength={500}
              className="border border-[#DDD8CC] bg-[#F5F2EC] px-3 py-2 text-base outline-none focus:border-[#253722] focus:bg-white transition-colors placeholder:text-[#9A9A8A]"
            />
            <button
              type="submit"
              disabled={!trimmedTitle || createMutation.isPending}
              className="bg-[#253722] px-4 py-2 text-sm font-medium tracking-widest uppercase text-white disabled:cursor-not-allowed disabled:bg-[#DDD8CC] disabled:text-[#9A9A8A] hover:bg-[#0D1F0D] transition-colors"
            >
              {createMutation.isPending ? "Legger til..." : "Legg til ressurs"}
            </button>
          </form>

          {/* ── Error messages ────────────────────────────────────── */}
          {createMutation.isError ? (
            <p className="text-sm text-[#8B1A1A] border border-[#8B1A1A] bg-[#8B1A1A]/5 px-3 py-2">
              Kunne ikke legge til ressursen: {createMutation.error.message}
            </p>
          ) : null}

          {deleteMutation.isError ? (
            <p className="text-sm text-[#8B1A1A] border border-[#8B1A1A] bg-[#8B1A1A]/5 px-3 py-2">
              Kunne ikke fjerne ressursen: {deleteMutation.error.message}
            </p>
          ) : null}

          {updateMutation.isError ? (
            <p className="text-sm text-[#8B1A1A] border border-[#8B1A1A] bg-[#8B1A1A]/5 px-3 py-2">
              Kunne ikke oppdatere ressursen: {updateMutation.error.message}
            </p>
          ) : null}

          {/* ── Resource list ─────────────────────────────────────── */}
          <section className="border border-[#DDD8CC] bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-[#DDD8CC] bg-[#253722]">
              <h2 className="text-xs font-medium tracking-widest uppercase text-white">
                Alle ressurser
              </h2>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Søk..."
                className="border border-[#3A5C34] bg-[#0D1F0D] text-white px-3 py-1 text-sm outline-none focus:border-white placeholder:text-[#7A9A7A] transition-colors w-36"
              />
            </div>

            <div className="px-5">
              {itemsQuery.isPending ? (
                <p className="py-4 text-sm text-[#5A5A4A]">Laster ressurser...</p>
              ) : null}

              {itemsQuery.isError ? (
                <p className="py-4 text-sm text-[#8B1A1A]">
                  Kunne ikke laste ressurser: {itemsQuery.error.message}
                </p>
              ) : null}

              {!itemsQuery.isPending && !itemsQuery.isError ? (
                resources.length > 0 ? (
                  <ul className="divide-y divide-[#DDD8CC]">
                    {resources.map((resource) =>
                      editing?.id === resource.id ? (
                        <li key={resource.id} className="py-4">
                          <form className="flex flex-col gap-2" onSubmit={handleEditSave}>
                            <input
                              value={editing.title}
                              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                              maxLength={120}
                              className="border border-[#DDD8CC] bg-[#F5F2EC] px-3 py-1.5 text-sm outline-none focus:border-[#253722] focus:bg-white transition-colors"
                            />
                            <input
                              value={editing.category}
                              onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                              placeholder="Kategori"
                              maxLength={60}
                              className="border border-[#DDD8CC] bg-[#F5F2EC] px-3 py-1.5 text-sm outline-none focus:border-[#253722] focus:bg-white transition-colors"
                            />
                            <input
                              value={editing.description}
                              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                              placeholder="Beskrivelse (valgfritt)"
                              maxLength={500}
                              className="border border-[#DDD8CC] bg-[#F5F2EC] px-3 py-1.5 text-sm outline-none focus:border-[#253722] focus:bg-white transition-colors"
                            />
                            <div className="flex gap-2 pt-1">
                              <button
                                type="submit"
                                disabled={!editing.title.trim() || updateMutation.isPending}
                                className="bg-[#253722] px-4 py-1.5 text-sm font-medium tracking-widest uppercase text-white disabled:cursor-not-allowed disabled:bg-[#DDD8CC] disabled:text-[#9A9A8A] hover:bg-[#0D1F0D] transition-colors"
                              >
                                {updateMutation.isPending ? "Lagrer..." : "Lagre"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditing(null)}
                                className="border border-[#DDD8CC] px-4 py-1.5 text-sm text-[#5A5A4A] hover:border-[#253722] hover:text-[#253722] transition-colors"
                              >
                                Avbryt
                              </button>
                            </div>
                          </form>
                        </li>
                      ) : (
                        <li key={resource.id} className="flex items-start justify-between gap-3 py-4">
                          <div className="min-w-0">
                            <p className="font-medium text-[#1A1A14]">{resource.title}</p>
                            {resource.category ? (
                              <p className="text-xs tracking-widest uppercase text-[#5A5A4A] mt-0.5">{resource.category}</p>
                            ) : null}
                            {resource.description ? (
                              <p className="mt-1 text-sm text-[#5A5A4A]">{resource.description}</p>
                            ) : null}
                          </div>
                          <div className="flex shrink-0 gap-2 pt-0.5">
                            <button
                              type="button"
                              onClick={() => startEdit(resource)}
                              disabled={deleteMutation.isPending}
                              className="border border-[#DDD8CC] px-3 py-1 text-sm text-[#5A5A4A] hover:border-[#253722] hover:text-[#253722] disabled:cursor-not-allowed disabled:border-[#DDD8CC] disabled:text-[#9A9A8A] transition-colors"
                            >
                              Rediger
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteMutation.mutate({ id: resource.id })}
                              disabled={deleteMutation.isPending}
                              className="border border-[#DDD8CC] px-3 py-1 text-sm text-[#5A5A4A] hover:border-[#8B1A1A] hover:text-[#8B1A1A] disabled:cursor-not-allowed disabled:border-[#DDD8CC] disabled:text-[#9A9A8A] transition-colors"
                            >
                              {deleteMutation.isPending && deletingId === resource.id
                                ? "Fjerner..."
                                : "Fjern"}
                            </button>
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="py-4 text-sm text-[#5A5A4A]">Ingen ressurser enda.</p>
                )
              ) : null}
            </div>
          </section>

        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="bg-[#0D1F0D] px-6 py-3 text-center">
        <p className="text-xs tracking-widest uppercase text-[#7A9A7A]">
          Forsvaret &mdash; Cyfor &mdash; Ressursbooking
        </p>
      </footer>

    </div>
  );
}
