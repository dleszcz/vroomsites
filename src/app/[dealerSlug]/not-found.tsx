import { CustomNotFound } from "@/components/custom-not-found";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Strona nie istnieje",
  description: "Przepraszamy, ale strona której szukasz nie istnieje.",
};

export default function DealerNotFound() {
  return <CustomNotFound />;
}
