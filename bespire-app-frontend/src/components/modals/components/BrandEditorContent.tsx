import React from "react";
import type { UploadedFile } from "./types";
import Button from "../../ui/Button";

type Props = {
  name: string;
  setName: (v: string) => void;
  logos: UploadedFile[];
  fonts: UploadedFile[];
  isUploadingLogo: boolean;
  isUploadingFontHeadings: boolean;
  isUploadingFontBody: boolean;
  logoInputRef: React.RefObject<HTMLInputElement | null>;
  fontHeadingInputRef: React.RefObject<HTMLInputElement | null>;
  fontBodyInputRef: React.RefObject<HTMLInputElement | null>;
  onLogoClick: () => void;
  onFontHeadingClick: () => void;
  onFontBodyClick: () => void;
  onLogoFiles: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void> | void;
  onFontFiles: (e: React.ChangeEvent<HTMLInputElement>, category?: 'headings' | 'body') => Promise<void> | void;
  description: string;
  setDescription: (v: string) => void;
  buyer: string;
  setBuyer: (v: string) => void;
  tone: string;
  setTone: (v: string) => void;
  likes: string;
  setLikes: (v: string) => void;
  dislikes: string;
  setDislikes: (v: string) => void;
  archetype: string;
  setArchetype: (v: string) => void;
  primaryColors: string[];
  secondaryColors: string[];
  colorPickerOpen: null | 'primary' | 'secondary';
  colorValue: string;
  setColorValue: (v: string) => void;
  setColorPickerOpen: (v: null | 'primary' | 'secondary') => void;
  addColor: (section: 'primary' | 'secondary') => void;
  removePrimaryColor: (i: number) => void;
  removeSecondaryColor: (i: number) => void;
  removeLogo: (i: number) => void;
  removeFont: (i: number) => void;
  // activeItem/setActiveItem no usados en este componente
  logoRef: React.RefObject<HTMLDivElement | null>;
  colorsRef: React.RefObject<HTMLDivElement | null>;
  fontsRef: React.RefObject<HTMLDivElement | null>;
  archetypeRef: React.RefObject<HTMLDivElement | null>;
  descriptionRef: React.RefObject<HTMLDivElement | null>;
  buyerRef: React.RefObject<HTMLDivElement | null>;
  toneRef: React.RefObject<HTMLDivElement | null>;
  likesRef: React.RefObject<HTMLDivElement | null>;
  dislikesRef: React.RefObject<HTMLDivElement | null>;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function BrandEditorContent({
  name,
  setName,
  logos,
  fonts,
  isUploadingLogo,
  isUploadingFontHeadings,
  isUploadingFontBody,
  logoInputRef,
  fontHeadingInputRef,
  fontBodyInputRef,
  onLogoClick,
  onFontHeadingClick,
  onFontBodyClick,
  onLogoFiles,
  onFontFiles,
  description,
  setDescription,
  buyer,
  setBuyer,
  tone,
  setTone,
  likes,
  setLikes,
  dislikes,
  setDislikes,
  archetype,
  setArchetype,
  primaryColors,
  secondaryColors,
  colorPickerOpen,
  colorValue,
  setColorValue,
  setColorPickerOpen,
  addColor,
  removePrimaryColor,
  removeSecondaryColor,
  removeLogo,
  removeFont,
  logoRef,
  colorsRef,
  fontsRef,
  archetypeRef,
  descriptionRef,
  buyerRef,
  toneRef,
  likesRef,
  dislikesRef,
  handleSubmit,
}: Props) {
  return (
    <div className="flex-1 flex flex-col py-6 px-6 pb-2 h-full min-w-0 overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-2xl font-bold">{name ? "Edit Brand" : "Customize Your Brand"}</h3>
        <button className="text-gray-600 hover:text-black" type="button">
          {/* placeholder for close in parent */}
        </button>
      </div>

      <form className="flex flex-col flex-1 min-h-0" onSubmit={handleSubmit}>
        <div className="overflow-y-auto pr-2 flex-1 min-h-0 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="block font-semibold text-sm">Brand Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Brand name"
              className="w-full border border-gray-300 rounded-md p-2  outline-none"
              required
              minLength={2}
              maxLength={100}
              autoFocus
            />
          </div>

          <section ref={logoRef} className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <h4 className="font-semibold">Logo</h4>

              <div className="min-w-[120px] flex items-center justify-end gap-2">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*,image/svg+xml"
                  multiple
                  className="hidden"
                  onChange={onLogoFiles}
                />
                <Button
                  type="button"
                  variant="outlineG"
                  size="sm"
                  onClick={onLogoClick}
                  disabled={isUploadingLogo}
                >
                  {isUploadingLogo ? "Uploading..." : "Upload +"}
                </Button>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Upload your logo variations (icons, wordmarks, favicons, etc.) in
              formats like JPG, PNG, SVG, AI, or EPS.
            </p>

            <div className="flex items-center gap-4 mt-3">
              <div className="flex gap-6">
                {logos.length === 0 && (
                  <div className="text-sm text-gray-400">No logos uploaded yet</div>
                )}
                {logos.map((l: UploadedFile, idx: number) => (
                  <div className="w-32 h-32 flex flex-col items-center justify-center relative gap-2" key={idx}>
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex items-center justify-center bg-green-gray-50">
                      <img src={l.url} alt={l.name || `Logo ${idx + 1}`} className="max-w-full max-h-full object-contain cursor-pointer" />
                    </div>

                    <button type="button" onClick={() => removeLogo(idx)} className="absolute top-1 right-4 text-gray-400 cursor-pointer hover:text-gray-600 bg-white rounded-full w-5 h-5 flex items-center justify-center ">×</button>
                    <div className="text-xs text-gray-500 max-w-[100px] truncate p-1">{l.name}</div>
                    <div className="mt-1 flex items-center gap-2">
                      {l.url && (
                        <a href={l.url} download target="_blank" rel="noopener noreferrer" className="text-xs text-green-gray-800 underline">Download</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Colors section */}
          <section ref={colorsRef} className="flex flex-col gap-4">
            <h4 className="font-semibold">Colors</h4>
            <p className="text-sm text-gray-500">
              Enter your brand&apos;s HEX codes.
            </p>

            <div className="flex flex-col gap-4 mt-3 border border-green-gray-200 rounded-md p-4">
              <div className="p-2 relative border-b border-green-gray-200 pb-4">
                <div className="font-medium text-sm mb-2">Primary Colors</div>
                <div className="flex items-center gap-3">
                  {primaryColors.map((c: string, i: number) => (
                    <div key={`${c}-${i}`} className="flex flex-col items-center relative gap-1 group">
                      <div style={{ background: c }} className="w-12 h-12 rounded-full" />
                      <div className="text-xs mt-1 text-gray-600">{c}</div>
                      <button type="button" onClick={() => removePrimaryColor(i)} className="absolute -top-2 -right-2 bg-white rounded-full w-5 h-5 text-xs text-gray-400 border cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-150">×</button>
                    </div>
                  ))}

                  <div className="relative">
                    <div className="flex flex-col items-center gap-2">
                      <button data-color-trigger type="button" onClick={() => { setColorPickerOpen('primary'); setColorValue('#ffffff'); }} className="w-12 h-12 bg-green-gray-50 rounded-full  flex items-center justify-center text-green-gray-300 text-xl cursor-pointer font-medium">+</button>
                      <span className="text-green-gray-300 font-medium text-xs">Add a color</span>
                    </div>

                    {colorPickerOpen === 'primary' && (
                      <div className="z-30 bg-white border border-green-gray-50 rounded-md p-3 shadow-sm w-72 mt-2">
                        <div className="flex items-center gap-3">
                          <input type="color" value={colorValue} onChange={(e) => setColorValue(e.target.value)} className="w-12 h-8 p-0 border-0" />
                          <input value={colorValue} onChange={(e) => setColorValue(e.target.value)} className="border border-green-gray-300 rounded-md p-2 text-sm w-full" placeholder="#abcdef" />
                        </div>
                        <div className="flex items-center justify-end gap-2 mt-3">
                          <Button type="button" variant="green2" size="sm" onClick={() => addColor('primary')}>Add</Button>
                          <Button type="button" variant="ghost" size="sm" onClick={() => setColorPickerOpen(null)}>Cancel</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-2 relative">
                <div className="font-medium text-sm mb-2">Secondary Colors</div>
                <div className="flex items-center gap-3">
                  {secondaryColors.map((c: string, i: number) => (
                    <div key={`${c}-${i}`} className="flex flex-col items-center relative gap-1 group">
                      <div style={{ background: c }} className="w-12 h-12 rounded-full" />
                      <div className="text-xs mt-1 text-gray-600">{c}</div>
                      <button type="button" onClick={() => removeSecondaryColor(i)} className="absolute -top-2 -right-2 bg-white rounded-full w-5 h-5 text-xs text-gray-400 border cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-150">×</button>
                    </div>
                  ))}

                  <div className="relative">
                    <div className="flex flex-col items-center gap-2">
                      <button data-color-trigger type="button" onClick={() => { setColorPickerOpen('secondary'); setColorValue('#ffffff'); }} className="w-12 h-12 bg-green-gray-50 rounded-full  flex items-center justify-center text-green-gray-300 text-xl cursor-pointer font-medium">+</button>
                      <span className="text-green-gray-300 font-medium text-xs">Add a color</span>
                    </div>

                    {colorPickerOpen === 'secondary' && (
                      <div className="z-30 bg-white border border-green-gray-50 rounded-md p-3 shadow-sm w-72 mt-2">
                        <div className="flex items-center gap-3">
                          <input type="color" value={colorValue} onChange={(e) => setColorValue(e.target.value)} className="w-12 h-8 p-0 border-0" />
                          <input value={colorValue} onChange={(e) => setColorValue(e.target.value)} className="border border-green-gray-300 rounded-md p-2 text-sm w-full" placeholder="#abcdef" />
                        </div>
                        <div className="flex items-center justify-end gap-2 mt-3">
                          <Button type="button" variant="green2" size="sm" onClick={() => addColor('secondary')}>Add</Button>
                          <Button type="button" variant="ghost" size="sm" onClick={() => setColorPickerOpen(null)}>Cancel</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Fonts section */}
          <section ref={fontsRef} className="flex flex-col gap-4">
            <div>
              <h4 className="font-semibold">Fonts</h4>
              <p className="text-sm text-gray-500">Upload your brand fonts (TTF, OTF, WOFF).</p>
            </div>

            <div className="border-t border-gray-200 pt-4 flex flex-col gap-6">
              <div>
                <input ref={fontHeadingInputRef} type="file" accept=".ttf,.otf,.woff,.woff2" multiple className="hidden" onChange={(e) => onFontFiles(e, 'headings')} />
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-700 text-base">Headings & Titles</h5>
                  <Button type="button" variant="outlineG" size="sm" onClick={onFontHeadingClick} disabled={isUploadingFontHeadings}>{isUploadingFontHeadings ? 'Uploading...' : 'Upload +'}</Button>
                </div>

                <div className="space-y-2">
                  {fonts.filter((f: UploadedFile) => f.category === 'headings').length > 0 ? (
                    fonts.filter((f: UploadedFile) => f.category === 'headings').map((font: UploadedFile, index: number) => {
                      const globalIndex = fonts.findIndex((f: UploadedFile) => f.url === font.url);
                      return (
                        <div key={font.url || index} className="flex items-center justify-between border-b border-gray-100 py-3 last:border-b-0">
                          <p className="text-2xl font-normal" style={{ fontFamily: `'${font.family}', sans-serif` }}>{font.family || font.name}</p>
                          <div className="flex items-center gap-4">
                            <button type="button" className="text-gray-400 hover:text-gray-600 cursor-not-allowed" title="Edit coming soon">✎</button>
                            <button type="button" onClick={() => removeFont(globalIndex)} className="text-gray-400 hover:text-red-500">🗑</button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-400 py-2">No fonts uploaded for headings.</p>
                  )}
                </div>
              </div>

              <div>
                <input ref={fontBodyInputRef} type="file" accept=".ttf,.otf,.woff,.woff2" multiple className="hidden" onChange={(e) => onFontFiles(e, 'body')} />
                <div className="flex items-center justify-between mb-3 border-t border-gray-200 pt-4">
                  <h5 className="font-medium text-gray-700 text-base">Body</h5>
                  <Button type="button" variant="outlineG" size="sm" onClick={onFontBodyClick} disabled={isUploadingFontBody}>{isUploadingFontBody ? 'Uploading...' : 'Upload +'}</Button>
                </div>

                <div className="space-y-2">
                  {fonts.filter((f: UploadedFile) => f.category === 'body').length > 0 ? (
                    fonts.filter((f: UploadedFile) => f.category === 'body').map((font: UploadedFile, index: number) => {
                      const globalIndex = fonts.findIndex((f: UploadedFile) => f.url === font.url);
                      return (
                        <div key={font.url || index} className="flex items-center justify-between border-b border-gray-100 py-3 last:border-b-0">
                          <p className="text-xl font-normal" style={{ fontFamily: `'${font.family}', sans-serif` }}>{font.family || font.name}</p>
                          <div className="flex items-center gap-4">
                            <button type="button" className="text-gray-400 hover:text-gray-600 cursor-not-allowed" title="Edit coming soon">✎</button>
                            <button type="button" onClick={() => removeFont(globalIndex)} className="text-gray-400 hover:text-red-500">🗑</button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-400 py-2">No fonts uploaded for body text.</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Archetype */}
          <section ref={archetypeRef} className="flex flex-col gap-2">
            <h4 className="font-semibold">Brand Archetype</h4>
            <p className="text-sm text-gray-500">Define your brand&apos;s personality.</p>
            <select className="mt-2 w-full border border-gray-300 rounded-md p-2 outline-none" value={archetype} onChange={(e) => setArchetype(e.target.value)}>
              <option value="">Select archetype</option>
              <option value="ruler">The Ruler</option>
              <option value="creator">The Creator</option>
              <option value="explorer">The Explorer</option>
            </select>
          </section>

          {/* Description */}
          <section ref={descriptionRef} className="flex flex-col gap-2">
            <h4 className="font-semibold">Brand Description</h4>
            <p className="text-sm text-gray-500">Summarize your mission.</p>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-2 w-full border border-gray-300 rounded-md p-2 outline-none p-3 min-h-[120px]" placeholder="Write a short brand description..." />
          </section>

          {/* Buyer Persona */}
          <section ref={buyerRef} className="flex flex-col gap-2">
            <h4 className="font-semibold">Buyer Persona</h4>
            <p className="text-sm text-gray-500">Describe your ideal customer.</p>
            <textarea value={buyer} onChange={(e) => setBuyer(e.target.value)} className="mt-2 w-full border border-gray-300 rounded-md p-2 outline-none min-h-[100px]" placeholder="Describe buyer persona..." />
          </section>

          {/* Tone */}
          <section ref={toneRef} className="flex flex-col gap-2">
            <h4 className="font-semibold">Tone of Voice</h4>
            <p className="text-sm text-gray-500">Specify your communication style.</p>
            <textarea value={tone} onChange={(e) => setTone(e.target.value)} className="mt-2 w-full border border-gray-300 rounded-md p-2 outline-none min-h-[100px]" placeholder="e.g. Friendly, professional" />
          </section>

          {/* Likes */}
          <section ref={likesRef} className="flex flex-col gap-2">
            <h4 className="font-semibold">References You Like</h4>
            <p className="text-sm text-gray-500">Share examples of designs you admire.</p>
            <input value={likes} onChange={(e) => setLikes(e.target.value)} className="mt-2 w-full border border-gray-300 rounded-md p-2 outline-none" placeholder="Add a reference or notes..." />
          </section>

          {/* Dislikes */}
          <section ref={dislikesRef} className="flex flex-col gap-2">
            <h4 className="font-semibold">References You Don&apos;t Like</h4>
            <p className="text-sm text-gray-500">Provide examples you dislike and why.</p>
            <input value={dislikes} onChange={(e) => setDislikes(e.target.value)} className="mt-2 w-full border border-gray-300 rounded-md p-2 outline-none" placeholder="What to avoid..." />
          </section>

        </div>

        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm py-4 flex items-center justify-center gap-4 mt-2 ">
          <Button type="button" variant="outlineG" onClick={() => { /* parent handles close */ }} className="w-full">Cancel</Button>
          <Button type="submit" variant="green2" className="w-full">Save</Button>
        </div>
      </form>
    </div>
  );
}
