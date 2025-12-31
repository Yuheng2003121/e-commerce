"use client";
import React, { useState } from "react";
import { ReviewsGetOneOutput } from "../../types";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import StarPicker from "@/components/StarPicker";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ReviewFormProps {
  productId: string;
  initialData: ReviewsGetOneOutput;
}

const formSchema = z.object({
  rating: z
    .number()
    .min(0, { message: "Rating must be between 0 and 5" })
    .max(5, { message: "Rating must be between 0 and 5" }),
  description: z.string().min(1, { message: "Description is required" }),
});
export default function ReviewForm({
  productId,
  initialData,
}: ReviewFormProps) {
  const [isPreview, setIsPreview] = useState(!!initialData);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: initialData?.rating ?? 0,
      description: initialData?.description ?? "",
    },
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createReview = useMutation(
    trpc.reviews.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.reviews.getOne.queryOptions({ productId })
        );
        setIsPreview(true);
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const updateReview = useMutation(
    trpc.reviews.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.reviews.getOne.queryOptions({ productId })
        );
        setIsPreview(true);
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (initialData) {
      updateReview.mutate({
        reviewId: initialData.id,
        ...values,
      });
    } else {
      createReview.mutate({
        productId,
        ...values,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <p className="font-medium">
          {isPreview ? "Your rating:" : "Liked it? Give a rating"}
        </p>

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <StarPicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPreview}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Write a review..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isPreview && (
          <Button
            variant={"elevated"}
            disabled={createReview.isPending || updateReview.isPending}
            type="submit"
            size="lg"
            className="bg-black text-white hover:bg-pink-400 hover:text-primary w-fit"
          >
            {initialData ? "Update Review" : "Post Review"}
          </Button>
        )}

        {isPreview && (
          <Button
            size="lg"
            type="button"
            variant={"elevated"}
            className="w-fit"
            onClick={() => setIsPreview(false)}
          >
            Edit
          </Button>
        )}
      </form>
    </Form>
  );
}
