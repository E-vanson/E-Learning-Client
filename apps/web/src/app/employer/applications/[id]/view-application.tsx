"use client";

import { Proposal, Job, Freelancer, EstimatedTime, ProposalStatus } from "@elearning/lib/models";
import { formatTimestamp, uppercaseFirstChar } from "@elearning/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,  
} from "@elearning/ui";
import {
  Input,
  Textarea,
} from "@elearning/ui/forms";
import { FileText, Download, ImageIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { z } from "zod";

// Zod schema matching Proposal interface
const proposalSchema = z.object({
  id: z.number(),
  job: z.object({
    id: z.string(),
    title: z.string(),
    // Include other Job properties as needed
  }),
  freelancer: z.object({
    id: z.string(),
    name: z.string(),
    // Include other Freelancer properties as needed  
  }),
  cover_letter: z.string(),
  bid_amount: z.number(),
  estimated_time: z.enum(["1 Month", "1 - 2 Months", "3 Months", "More Than 3 Months"]),
  status: z.enum(["pending", "accepted", "rejected", "withdrawn"]),
  file_attachment: z.string().optional(),
  audit: z.object({
    createdAt: z.date(),
    updatedAt: z.date(),
  }).optional()
});

interface ProposalViewPageProps {
  proposal: Proposal;
}

export default function ProposalViewPage({ 
  proposal
}: ProposalViewPageProps) {
  const getFileType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(extension || '')) return 'pdf';
    if (['png', 'jpg', 'jpeg', 'gif'].includes(extension || '')) return 'image';
    if (['mp4', 'mov', 'avi'].includes(extension || '')) return 'video';
    return 'other';
  };

  return (
    <div className="flex flex-col relative">
      <nav className="flex gap-3 items-center fixed top-0 inset-x-0 bg-background px-4 h-[65px] border-b z-[100] shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/proposals">Proposals</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {proposal?.job?.title.slice(0, 20)}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="ml-auto flex items-center gap-4">
          <div className={`px-3 py-1 rounded-full text-sm ${
            proposal.status === 'accepted' ? 'bg-green-100 text-green-800' :
            proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
          </div>
        </div>
      </nav>

      <div className="grow mt-[65px]">
        <div className="container max-w-3xl 2xl:max-w-4xl mt-7 mb-16 space-y-8">
          {/* Proposal Metadata */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Job Title</label>
              <Input 
                value={proposal.job.title}
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Freelancer</label>
              <Input 
                value={proposal.freelancer.overview}
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Bid Amount</label>
              <Input
                value={proposal.bid_amount}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Estimated Time</label>
              <Input
                value={proposal.estimated_time}
                readOnly
              />
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium mb-2">Cover Letter</label>
            <Textarea
              value={proposal.cover_letter}
              readOnly
              rows={8}
              className="resize-none bg-muted/50"
            />
          </div>

          {/* File Attachment */}
          {proposal.file_attachment && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Attached Proposal Document
              </h3>
              
              <div className="border rounded-lg overflow-hidden bg-muted/50">
                {getFileType(proposal.file_attachment) === 'pdf' && (
                  <iframe
                    src={proposal.file_attachment}
                    className="w-full h-96"
                    title="Proposal Document"
                  />
                )}

                {getFileType(proposal.file_attachment) === 'image' && (
                  <img
                    src={proposal.file_attachment}
                    alt="Proposal Attachment"
                    className="w-full object-contain max-h-96"
                  />
                )}

                {getFileType(proposal.file_attachment) === 'video' && (
                  <video
                    controls
                    className="w-full"
                    src={proposal.file_attachment}
                  />
                )}

                <div className="p-4 border-t flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {proposal.audit?.createdAt && 
                      `Submitted On ${formatTimestamp(proposal.audit.createdAt)}`}
                  </span>
                  
                  <Button asChild variant="outline">
                    <a 
                      href={proposal.file_attachment}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download File
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}