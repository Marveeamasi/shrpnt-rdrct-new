"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ref, get, set, db } from "@/lib/config";
import utils from "@/lib/utils";
import Image from "next/image";

export default function AdminPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const presetIcons = ["excel", "pdf", "folder"];

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState({});

  const [forms, setForms] = useState({
    form1: { title: "", icon: "", image: "" },
    form2: { title: "", icon:

 "", image: "" },
    form3: { title: "", icon: "", image: "" },
    form4: { title: "", icon: "", image: "" },
    form5: { title: "", icon: "", image: "" },
    form6: { title: "", icon: "", image: "" },
    form7: { title: "" },
  });

  useEffect(() => {
    fetch("/api/section")
      .then((res) => res.json())
      .then((data) => {
        if (id !== data.type) {
          router.push("/");
        }
      });
  }, [id, router]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const paths = [
          "form1",
          "form2",
          "form3",
          "form4",
          "form5",
          "form6",
          "form7",
        ];

        const snapshots = await Promise.all(
          paths.map((path) =>
            get(ref(db, `${process.env.NEXT_PUBLIC_GY}/${path}`))
          )
        );

        const updatedForms = { ...forms };
        snapshots.forEach((snapshot, index) => {
          const key = paths[index];
          const data = snapshot.val();
          if (data) {
            updatedForms[key] = { ...updatedForms[key], ...data };
          }
        });

        setForms(updatedForms);
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };

    fetchForms();
  }, []);

  const handleImageUpload = async (e, formKey) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage((prev) => ({ ...prev, [formKey]: true }));

    try {
      const imageUrl = await utils(file);
      setForms((prev) => ({
        ...prev,
        [formKey]: {
          ...prev[formKey],
          image: imageUrl,
          icon: "",
        },
      }));
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed: " + error.message);
    } finally {
      setUploadingImage((prev) => ({ ...prev, [formKey]: false }));
    }
  };

  const handleSubmit = async (e, formKey) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formRef = ref(db, `${process.env.NEXT_PUBLIC_GY}/${formKey}`);
      const snapshot = await get(formRef);
      const existingData = snapshot.val() || {};

      const updatedData = {
        ...existingData,
        ...forms[formKey],
      };

      await set(formRef, updatedData);
      alert(`${formKey.toUpperCase()} updated successfully!`);
    } catch (error) {
      console.error("Error updating form:", error);
      alert("Failed to update. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const IconForm = ({ formKey, label }) => (
    <form
      onSubmit={(e) => handleSubmit(e, formKey)}
      className="bg-[#81818117] backdrop-blur-lg p-6 rounded-lg shadow-lg w-full max-w-[500px] flex flex-col"
    >
      <h2 className="text-xl font-semibold mb-4">{label}</h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={forms[formKey].title || ""}
          onChange={(e) =>
            setForms({
              ...forms,
              [formKey]: { ...forms[formKey], title: e.target.value },
            })
          }
          className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
          required
        />

        <div className="space-y-2">
          <label className="text-sm text-gray-300">Upload Custom Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, formKey)}
            className="w-full p-2 bg-gray-700 rounded-md text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
          {uploadingImage[formKey] && (
            <p className="text-yellow-400 text-sm">Uploading image...</p>
          )}
          {forms[formKey].image && (
            <div className="relative w-full h-32 mt-3 rounded-lg overflow-hidden border border-gray-600">
              <Image
                src={forms[formKey].image}
                alt="Uploaded preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() =>
                  setForms((prev) => ({
                    ...prev,
                    [formKey]: { ...prev[formKey], image: "" },
                  }))
                }
                className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {!forms[formKey].image && (
          <select
            value={forms[formKey].icon || ""}
            onChange={(e) =>
              setForms({
                ...forms,
                [formKey]: { ...forms[formKey], icon: e.target.value },
              })
            }
            className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            required={!forms[formKey].image}
          >
            <option value="">Select Preset Icon</option>
            {presetIcons.map((icon) => (
              <option key={icon} value={icon}>
                {icon.charAt(0).toUpperCase() + icon.slice(1)}
              </option>
            ))}
          </select>
        )}

        {forms[formKey].image && (
          <p className="text-green-400 text-sm">Using custom image</p>
        )}

        <button
          type="submit"
          disabled={loading || uploadingImage[formKey]}
          className="w-full p-[15px] bg-[#3858f9] hover:bg-blue-600 disabled:opacity-70 rounded-md transition-colors text-white font-medium"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-10 text-center">Admin Dashboard</h1>

      <div className="space-y-10 w-full max-w-5xl">
        <form
          onSubmit={(e) => handleSubmit(e, "form7")}
          className="bg-[#81818117] backdrop-blur-lg p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto"
        >
          <h2 className="text-xl font-semibold mb-4 text-blue-300">Redirect URL</h2>
          <div className="space-y-4">
            <input
              type="url"
              placeholder="https://example.com"
              value={forms.form7.title || ""}
              onChange={(e) =>
                setForms({
                  ...forms,
                  form7: { title: e.target.value },
                })
              }
              className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full p-[15px] bg-green-600 hover:bg-green-700 disabled:opacity-70 rounded-md transition-colors text-white font-medium"
            >
              {loading ? "Updating..." : "Update Redirect URL"}
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <IconForm formKey="form1" label="File 1 - Icon & Title" />
          <IconForm formKey="form2" label="File 2 - Icon & Title" />
          <IconForm formKey="form3" label="File 3 - Icon & Title" />
          <IconForm formKey="form4" label="File 4 - Icon & Title" />
          <IconForm formKey="form5" label="File 5 - Icon & Title" />
          <IconForm formKey="form6" label="File 6 - Icon & Title" />
        </div>
      </div>
    </div>
  );
}