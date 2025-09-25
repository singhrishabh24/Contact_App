/** @format */
import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Modal from "./Modal";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { toast } from "react-toastify";
import * as Yup from "yup";

// ✅ Validation Schema
const contactSchemaValidation = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),

  email: Yup.string()
    .trim()
    .test("is-valid-email-or-empty", "Invalid Email", (value) => {
      if (!value) return true; // allow empty
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    })
    .test(
      "email-or-number",
      "Either email or number is required",
      function (value) {
        const { number } = this.parent || {};
        if (value && value.trim() !== "") return true;
        if (number && number.toString().trim() !== "") return true;
        return false;
      }
    ),

  number: Yup.string()
    .trim()
    .test("is-valid-number-or-empty", "Invalid Number", (value) => {
      if (!value) return true; // allow empty
      return /^\d+$/.test(value);
    })
    .test(
      "number-or-email",
      "Either email or number is required",
      function (value) {
        const { email } = this.parent || {};
        if (value && value.trim() !== "") return true;
        if (email && email.trim() !== "") return true;
        return false;
      }
    ),
});

const AddAndUpdateContact = ({ isOpen, onClose, isUpdate, contact }) => {
  // Add contact
  const addContact = async (contactData) => {
    try {
      const payload = {
        name: contactData.name,
        email: contactData.email?.trim() || null,
        number: contactData.number?.trim() ? Number(contactData.number) : null,
      };
      await addDoc(collection(db, "contacts"), payload);
      toast.success("Contact Added Successfully");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add contact");
    }
  };

  // Update contact
  const updateContact = async (contactData, id) => {
    try {
      const payload = {
        name: contactData.name,
        email: contactData.email?.trim() || null,
        number: contactData.number?.trim() ? Number(contactData.number) : null,
      };
      await updateDoc(doc(db, "contacts", id), payload);
      toast.success("Contact Updated Successfully");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update contact");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}>
      <Formik
        enableReinitialize
        initialValues={{
          name: isUpdate ? contact?.name ?? "" : "",
          email: isUpdate ? contact?.email ?? "" : "",
          number: isUpdate ? (contact?.number ?? "").toString() : "",
        }}
        validationSchema={contactSchemaValidation}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          try {
            if (isUpdate) {
              await updateContact(values, contact.id);
            } else {
              await addContact(values);
            }
          } finally {
            setSubmitting(false);
          }
        }}>
        {({ isSubmitting }) => (
          <Form className='flex flex-col gap-2'>
            {/* Name */}
            <div className='flex flex-col gap-1'>
              <label
                htmlFor='name'
                className='font-bold'>
                Name
              </label>
              <Field
                id='name'
                name='name'
                className='h-10 border px-2'
              />
              <div className='text-xs text-red-500'>
                <ErrorMessage name='name' />
              </div>
            </div>

            {/* Email */}
            <div className='flex flex-col gap-1'>
              <label
                htmlFor='email'
                className='font-bold'>
                Email
              </label>
              <Field
                id='email'
                type='email'
                name='email'
                className='h-10 border px-2'
              />
              <div className='text-xs text-red-500'>
                <ErrorMessage name='email' />
              </div>
            </div>

            {/* Number */}
            <div className='flex flex-col gap-1'>
              <label
                htmlFor='number'
                className='font-bold'>
                Number
              </label>
              <Field
                id='number'
                name='number'
                type='text'
                inputMode='numeric'
                pattern='\d*'
                className='h-10 border px-2'
              />
              <div className='text-xs text-red-500'>
                <ErrorMessage name='number' />
              </div>
            </div>

            {/* Submit */}
            <button
              type='submit'
              disabled={isSubmitting}
              className='self-end border bg-orange px-3 py-1.5 rounded cursor-pointer'>
              {isUpdate ? "Update" : "Add"} Contact
            </button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddAndUpdateContact;
