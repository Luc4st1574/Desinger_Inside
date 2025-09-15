/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import { useState, useEffect, useRef } from "react";
import { uploadImageToBackend } from "@/services/imageService";
import type { UploadedFile } from "./components/types";

import Logo from "@/assets/icons/modal_brands/logo.svg";
import Tone from "@/assets/icons/modal_brands/tone.svg";
import Archetype from "@/assets/icons/modal_brands/archetype.svg";
import BrandDescription from "@/assets/icons/modal_brands/brand_description.svg";
import Buyer from "@/assets/icons/modal_brands/buyer.svg";
import Colors from "@/assets/icons/modal_brands/colors.svg";
import Dislike from "@/assets/icons/modal_brands/dislike.svg";
import Fonts from "@/assets/icons/modal_brands/fonts.svg";
import Like from "@/assets/icons/modal_brands/like.svg";
import { showErrorToast } from "../ui/toast";
import BrandSidebar from "./components/BrandSidebar";
import BrandEditorContent from "./components/BrandEditorContent";



const SIDEBAR_ITEMS = [
  { id: "logo", label: "Logo", icon: <Logo className="w-5 h-5" />, disabled: false },
  { id: "colors", label: "Colors", icon: <Colors className="w-5 h-5" />, disabled: false },
  { id: "fonts", label: "Fonts", icon: <Fonts className="w-5 h-5" />, disabled: false },
  { id: "archetype", label: "Brand Archetype", icon: <Archetype className="w-5 h-5" />, disabled: false },
  {
    id: "description",
    label: "Brand Description",
    icon: <BrandDescription className="w-5 h-5" />,
    disabled: false,
  },
  { id: "buyer", label: "Buyer Persona", icon: <Buyer className="w-5 h-5" />, disabled: false },
  { id: "tone", label: "Tone of Voice", icon: <Tone className="w-5 h-5" />, disabled: false },
  { id: "likes", label: "References You Like", icon: <Like className="w-5 h-5" />, disabled: false },
  {
    id: "dislikes",
    label: "References You Don't Like",
    icon: <Dislike className="w-5 h-5" />,
    disabled: false,
  },
  // Puedes agregar más en el futuro
];

// Payload shape used when submitting a brand
type BrandPayload = {
  name: string;
  logos?: UploadedFile[];
  fonts?: UploadedFile[];
  description?: string;
  buyer?: string;
  tone?: string;
  likes?: string;
  dislikes?: string;
  archetype?: string;
  primaryColors?: string[];
  secondaryColors?: string[];
};

type RawAsset = string | Record<string, unknown>;

async function loadOpentypeModule() {
  try {
    //@ts-ignore
    const m = await import('opentype.js');
    return m as any;
  } catch (err) {
    console.log("Error loading opentype.js module:", err);
    return null;
  }
}

async function parseFontFamilyFromFile(file: File): Promise<string | undefined> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const ot = await loadOpentypeModule();
        if (!ot) {
          resolve(file.name.replace(/\.[^.]+$/, ''));
          return;
        }
        const font = ot.parse(arrayBuffer);
        const names = font.names || {};
        const fullName = (names.fullName && (names.fullName.en || Object.values(names.fullName)[0])) || (names.fontFamily && (names.fontFamily.en || Object.values(names.fontFamily)[0]));
        resolve(fullName || file.name.replace(/\.[^.]+$/, ''));
      } catch (e) {
        console.log("Error parsing font file:", e);
        resolve(file.name.replace(/\.[^.]+$/, ''));
      }
    };
    reader.onerror = () => resolve(file.name.replace(/\.[^.]+$/, ''));
    reader.readAsArrayBuffer(file);
  });
}

async function parseFontFamilyFromUrl(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    const ot = await loadOpentypeModule();
    if (!ot) return undefined;
    const font = ot.parse(arrayBuffer);
    const names = font.names || {};
    const fullName = (names.fullName && (names.fullName.en || Object.values(names.fullName)[0])) || (names.fontFamily && (names.fontFamily.en || Object.values(names.fontFamily)[0]));
    return fullName || undefined;
  } catch (e) {
    console.log("Error fetching font from URL:", e);
    return undefined;
  }
}

export default function ModalBrands({
  isOpen,
  onClose,
  onSubmit,
  onDelete, // <- Nueva prop
  editingBrand,
  //@ts-ignore
  loading,
  deleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  // ahora aceptamos un payload más amplio
  onSubmit: (formData: BrandPayload) => Promise<void>;
  onDelete?: () => Promise<void>;
  editingBrand?: Partial<BrandPayload & { logos?: RawAsset[]; fonts?: RawAsset[] }> | null;
  loading?: boolean;
  deleting?: boolean;
}) {
  const [name, setName] = useState("");

  // Refs para cada sección
  const logoRef = useRef<HTMLDivElement | null>(null);
  const colorsRef = useRef<HTMLDivElement | null>(null);
  const fontsRef = useRef<HTMLDivElement | null>(null);
  const archetypeRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const buyerRef = useRef<HTMLDivElement | null>(null);
  const toneRef = useRef<HTMLDivElement | null>(null);
  const likesRef = useRef<HTMLDivElement | null>(null);
  const dislikesRef = useRef<HTMLDivElement | null>(null);

  // file inputs refs
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  // legacy single ref kept for potential future use (not used currently)
  // const fontInputRef = useRef<HTMLInputElement | null>(null);
  const fontHeadingInputRef = useRef<HTMLInputElement | null>(null);
  const fontBodyInputRef = useRef<HTMLInputElement | null>(null);

  // estado para archivos subidos
  const [logos, setLogos] = useState<UploadedFile[]>([]);
  const [fonts, setFonts] = useState<UploadedFile[]>([]);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  // flags independientes para subir fuentes por categoría
  const [isUploadingFontHeadings, setIsUploadingFontHeadings] = useState(false);
  const [isUploadingFontBody, setIsUploadingFontBody] = useState(false);

  // otros campos
  const [description, setDescription] = useState("");
  const [buyer, setBuyer] = useState("");
  const [tone, setTone] = useState("");
  const [likes, setLikes] = useState("");
  const [dislikes, setDislikes] = useState("");
  const [archetype, setArchetype] = useState("");

  // colores
  // por defecto vacíos cuando creas una brand nueva
  const [primaryColors, setPrimaryColors] = useState<string[]>([]);
  const [secondaryColors, setSecondaryColors] = useState<string[]>([]);
  const [colorPickerOpen, setColorPickerOpen] = useState<
    null | "primary" | "secondary"
  >(null);
  const [colorValue, setColorValue] = useState<string>("#ffffff");

  // Note: Floating UI removed from modal; color pickers render inline inside editor.

  useEffect(() => {
    if (editingBrand) {
      setName(editingBrand.name || "");
      // si editingBrand trae assets, cargarlos al estado (si aplica)
      // normalizar logos: backend puede enviar array de strings (urls) o objetos
      if (editingBrand.logos) {
        const normalizedLogos: UploadedFile[] = (editingBrand.logos || []).map((l: RawAsset, i: number) => {
          if (typeof l === 'string') {
            const name = l.split('/').pop() || `logo-${i}`;
            return { url: l, name } as UploadedFile;
          }
          const obj = l as Record<string, unknown>;
          const url = (obj['url'] as string) || (obj['path'] as string) || '';
          const fileId = (obj['fileId'] as string) || (obj['_id'] as string) || (obj['id'] as string);
          const name = (obj['name'] as string) || (url ? url.split('/').pop() : `logo-${i}`);
          return {
            url,
            fileId,
            name,
            key: obj['key'] as string | undefined,
            size: obj['size'] as number | undefined,
            contentType: obj['contentType'] as string | undefined,
            createdAt: obj['createdAt'] as string | undefined,
          } as UploadedFile;
        });
        setLogos(normalizedLogos);
      }

      // normalizar fonts: backend puede devolver solo urls. Intentar leer family desde el archivo de la url
      if (editingBrand.fonts) {
        (async () => {
          const normalizedFonts: UploadedFile[] = await Promise.all((editingBrand.fonts || []).map(async (f: RawAsset, i: number) => {
            const obj = f as Record<string, unknown>;
            const url = typeof f === 'string' ? f : (obj['url'] as string);
            const name = typeof f === 'string' ? url.split('/').pop() || `font-${i}` : (obj['name'] as string) || `font-${i}`;
            let familyName: string | undefined = undefined;
            try {
              familyName = await parseFontFamilyFromUrl(url);
              if (familyName) {
                // @ts-ignore
                const fontFace = new FontFace(familyName, `url(${url})`);
                // @ts-ignore
                await fontFace.load();
                // @ts-ignore
                document.fonts.add(fontFace);
              }
            } catch {
              familyName = undefined;
            }

            return {
              url,
              name,
              family: familyName,
              category: (obj['category'] as string) || 'headings',
            } as UploadedFile;
          }));
          setFonts(normalizedFonts);
        })();
      }

      setDescription(editingBrand.description || "");
      setBuyer(editingBrand.buyer || "");
      setTone(editingBrand.tone || "");
      setLikes(editingBrand.likes || "");
      setDislikes(editingBrand.dislikes || "");
      setArchetype(editingBrand.archetype || "");
      setPrimaryColors(editingBrand.primaryColors || []);
      setSecondaryColors(editingBrand.secondaryColors || []);
    } else {
      setName("");
      setLogos([]);
      setFonts([]);
      setDescription("");
      setBuyer("");
      setTone("");
      setLikes("");
      setDislikes("");
      setArchetype("");
      setPrimaryColors([]);
      setSecondaryColors([]);
    }
  }, [editingBrand, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      logos,
      fonts,
      description,
      buyer,
      tone,
      likes,
      dislikes,
      archetype,
      primaryColors,
      secondaryColors,
    };

    onSubmit(payload);
  };

  // upload handlers
  const handleLogoFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingLogo(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
      // formData.append('linkedToType', 'brand');     // string
      //  formData.append('linkedToId', '12345');       // string
        // opcional: añadir metadata, ej workspace id
        const res = await uploadImageToBackend(formData);
        console.log("Logo upload response:", res);
        // res puede ser objeto con url, key, size, contentType, hash, createdAt
        setLogos((prev) => [...prev, { ...res}]);
      }
    } catch {
      const message = 'Logo upload failed';
      console.error('Logo upload failed');
      showErrorToast(message);
    } finally {
      setIsUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  // ... font parsing helpers are defined below (module-level) to keep them stable for hooks

  // ahora acepta una categoría para distinguir headings vs body
  const handleFontFiles = async (
    e: React.ChangeEvent<HTMLInputElement>,
    category: "headings" | "body" = "headings"
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    // marcar la categoría correspondiente como uploading
    if (category === "headings") setIsUploadingFontHeadings(true);
    else setIsUploadingFontBody(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // intentamos extraer family desde el archivo local antes de subir
        let parsedFamily: string | undefined = undefined;
        try {
          parsedFamily = await parseFontFamilyFromFile(file);
        } catch {
          parsedFamily = undefined;
        }

        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadImageToBackend(formData);

        // intentar registrar para preview con el family real (si se obtuvo)
        let familyName = parsedFamily;
        if (!familyName) {
          // si no pudimos parsear, generamos uno para evitar nombres vacíos
          familyName = `uploaded-font-${Date.now()}-${i}`;
        }
        try {
          // @ts-ignore
          const fontFace = new FontFace(familyName, `url(${res.url})`);
          // @ts-ignore
          await fontFace.load();
          // @ts-ignore
          document.fonts.add(fontFace);
        } catch {
          // no crítico si falla
        }

        setFonts((prev) => [
          ...prev,
          { ...res, name: file.name, family: familyName, category },
        ]);
      }
    } catch {
      console.error('Font upload failed');
    } finally {
      // resetear solo la flag de la categoría que inició la carga
      if (category === "headings") setIsUploadingFontHeadings(false);
      else setIsUploadingFontBody(false);
      if (fontHeadingInputRef.current) fontHeadingInputRef.current.value = "";
      if (fontBodyInputRef.current) fontBodyInputRef.current.value = "";
    }
  };

  const removeLogo = (index: number) => {
    setLogos((prev) => prev.filter((_, i) => i !== index));
  };
  const removeFont = (index: number) => {
    setFonts((prev) => prev.filter((_, i) => i !== index));
  };

  // Para cuando implementes navegación en el sidebar en el futuro
  const [activeItem, setActiveItem] = useState(0);

  const handleScrollTo = (id: string) => {
    const map: Record<string, React.RefObject<HTMLDivElement | null>> = {
      logo: logoRef,
      colors: colorsRef,
      fonts: fontsRef,
      archetype: archetypeRef,
      description: descriptionRef,
      buyer: buyerRef,
      tone: toneRef,
      likes: likesRef,
      dislikes: dislikesRef,
    };
    const ref = map[id];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const addColor = (section: "primary" | "secondary") => {
    const hex = colorValue.startsWith("#") ? colorValue : `#${colorValue}`;
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(hex)) return; // validar simple hex
    if (section === "primary") setPrimaryColors((p) => [...p, hex]);
    else setSecondaryColors((p) => [...p, hex]);
    setColorPickerOpen(null);
    setColorValue("#ffffff");
  };

  const removePrimaryColor = (idx: number) =>
    setPrimaryColors((p) => p.filter((_, i) => i !== idx));
  const removeSecondaryColor = (idx: number) =>
    setSecondaryColors((p) => p.filter((_, i) => i !== idx));

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50 p-4">
      <DialogBackdrop className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="fixed inset-0 flex justify-end p-4">
        <DialogPanel className="bg-white rounded-xl shadow-2xl flex w-full max-w-3xl overflow-hidden h-[calc(100vh-2rem)]">
          <BrandSidebar
            items={SIDEBAR_ITEMS}
            activeIndex={activeItem}
            onNavigate={(id: string, idx: number) => {
              setActiveItem(idx);
              handleScrollTo(id);
            }}
            onClose={onClose}
            onDelete={onDelete}
            editingBrand={editingBrand}
            deleting={deleting}
          />

          <BrandEditorContent
            name={name}
            setName={setName}
            logos={logos}
            fonts={fonts}
            isUploadingLogo={isUploadingLogo}
            isUploadingFontHeadings={isUploadingFontHeadings}
            isUploadingFontBody={isUploadingFontBody}
            logoInputRef={logoInputRef}
            fontHeadingInputRef={fontHeadingInputRef}
            fontBodyInputRef={fontBodyInputRef}
            onLogoClick={() => logoInputRef.current?.click()}
            onFontHeadingClick={() => fontHeadingInputRef.current?.click()}
            onFontBodyClick={() => fontBodyInputRef.current?.click()}
            onLogoFiles={handleLogoFiles}
            onFontFiles={handleFontFiles}
            description={description}
            setDescription={setDescription}
            buyer={buyer}
            setBuyer={setBuyer}
            tone={tone}
            setTone={setTone}
            likes={likes}
            setLikes={setLikes}
            dislikes={dislikes}
            setDislikes={setDislikes}
            archetype={archetype}
            setArchetype={setArchetype}
            primaryColors={primaryColors}
            secondaryColors={secondaryColors}
            colorPickerOpen={colorPickerOpen}
            colorValue={colorValue}
            setColorValue={setColorValue}
            setColorPickerOpen={setColorPickerOpen}
            addColor={addColor}
            removePrimaryColor={removePrimaryColor}
            removeSecondaryColor={removeSecondaryColor}
            removeLogo={removeLogo}
            removeFont={removeFont}
            //@ts-ignore
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            logoRef={logoRef}
            colorsRef={colorsRef}
            fontsRef={fontsRef}
            archetypeRef={archetypeRef}
            descriptionRef={descriptionRef}
            buyerRef={buyerRef}
            toneRef={toneRef}
            likesRef={likesRef}
            dislikesRef={dislikesRef}
            handleSubmit={handleSubmit}
          />
        </DialogPanel>
      </div>
    </Dialog>
  );
}
