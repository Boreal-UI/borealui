import TextInput from "../../../../src/components/TextInput/server/TextInput";
import TextArea from "../../../../src/components/TextArea/server/TextArea";
import Select from "../../../../src/components/Select/server/Select";

export default function ServerFields() {
  return <main>
    <h1>Server field associations</h1>
    {[1, 2].map((index) => <section key={index}>
      <TextInput label={`Server input ${index}`} helperText="Input description" errorMessage="Input error" />
      <TextArea label={`Server area ${index}`} helperText="Area description" errorMessage="Area error" />
      <Select label={`Server select ${index}`} helperText="Select description" errorMessage="Select error" options={[{ value: "", label: "All statuses" }, { value: "published", label: "Published" }]} />
    </section>)}
  </main>;
}
