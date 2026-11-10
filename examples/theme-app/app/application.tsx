"use client";
import Card from "../../../src/components/Card/next/Card";
import Modal from "../../../src/components/Modal/next/Modal";
import Button from "../../../src/components/Button/next/Button";
import TextInput from "../../../src/components/TextInput/next/TextInput";
import Select from "../../../src/components/Select/next/Select";
import DataTable from "../../../src/components/DataTable/next/DataTable";
import Portal from "../../../src/components/Portal/next/Portal";
import { SemanticThemeRecipes } from "../../../shared-story-assets/SemanticThemeRecipes";
import { savePublicationPreferences } from "./actions";

export default function Application() {
  return <SemanticThemeRecipes {...{ Card, Modal, Button, TextInput, Select, DataTable, Portal }} submitPreferences={savePublicationPreferences} />;
}
