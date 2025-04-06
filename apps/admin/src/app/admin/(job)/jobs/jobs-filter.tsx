"use client";

import { Select } from "@elearning/ui/forms";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function JobsFilter() {
  const router = useRouter();
  const sp = useSearchParams();

  const [status, setStatus] = useState<string>(sp.get("status") ?? "");
//   const [visibility, setVisibility] = useState<string>(
//     sp.get("visibility") ?? ""
//   );

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <Select
        value={status}
        onChange={(evt) => {
          const params = new URLSearchParams(sp.toString());
          if (evt.target.value) {
            params.set("status", evt.target.value);
          } else {
            params.delete("status");
          }

          params.delete("page");
          setStatus(evt.target.value);
          router.push(`?${params.toString()}`);
        }}
      >
        <option value="">All status</option>
        <option value="draft">Draft</option>
        <option value="active">Active</option>
        <option value="closed">Closed</option>
      </Select>
      {/* <Select
        value={visibility}
        onChange={(evt) => {
          const params = new URLSearchParams(sp.toString());
          if (evt.target.value) {
            params.set("visibility", evt.target.value);
          } else {
            params.delete("visibility");
          }
          params.delete("page");
          setVisibility(evt.target.value);
          router.push(`?${params.toString()}`);
        }}
      >
        <option value="">All visibility</option>
        <option value="public">Public</option>
        <option value="member">Member only</option>
        <option value="paid_member">Paid member only</option>
      </Select> */}
    </div>
  );
}
