'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AdminPageHeader } from './admin-page-header';
import {
  createOption, deleteOption, deleteSolution, getSolution, listAdminResource,
  listOptions, saveSolution, updateOption,
} from '../services/admin-api';

export function QuestionContentManager({ mode }) {
  const qc = useQueryClient();
  const [questionId, setQuestionId] = useState('');
  const questions = useQuery({
    queryKey: ['admin', 'questions'],
    queryFn: () => listAdminResource('questions', { limit: 100 }),
  });
  const options = useQuery({
    queryKey: ['admin', 'options', questionId],
    queryFn: () => listOptions(questionId),
    enabled: mode === 'options' && Boolean(questionId),
  });
  const solution = useQuery({
    queryKey: ['admin', 'solution', questionId],
    queryFn: () => getSolution(questionId),
    enabled: mode === 'solutions' && Boolean(questionId),
  });
  const [optionText, setOptionText] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  const add = useMutation({
    mutationFn: () => createOption(questionId, { optionText: optionText.trim(), isCorrect }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'options', questionId] });
      setOptionText('');
      setIsCorrect(false);
      toast.success('Option added');
    },
    onError: (e) => toast.error(e.message),
  });
  const changeOption = useMutation({
    mutationFn: ({ id, fields }) => updateOption(id, fields),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'options', questionId] }),
    onError: (e) => toast.error(e.message),
  });
  const removeOptionMutation = useMutation({
    mutationFn: deleteOption,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'options', questionId] }),
    onError: (e) => toast.error(e.message),
  });

  const title = mode === 'options' ? 'Options' : 'Solutions';
  return (
    <>
      <AdminPageHeader
        title={title}
        description={`Manage question ${mode === 'options' ? 'answer choices and correctness' : 'explanations'}.`}
      />
      <div className="mb-6 max-w-3xl space-y-2">
        <Label>Select question</Label>
        <Select value={questionId} onValueChange={setQuestionId}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Choose a question" /></SelectTrigger>
          <SelectContent>
            {(questions.data?.data.items ?? []).map((question) => (
              <SelectItem key={question.id} value={question.id}>
                <span className="line-clamp-1">{question.questionText}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!questionId ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
          Select a question to manage {mode}.
        </div>
      ) : mode === 'options' ? (
        <div className="max-w-3xl space-y-5">
          <div className="space-y-3">
            {(options.data ?? []).map((option, index) => (
              <div key={option.id} className="flex items-center gap-3 rounded-xl border bg-card p-4">
                <span className="flex size-8 items-center justify-center rounded-lg bg-muted font-semibold">{index + 1}</span>
                <p className="flex-1 text-sm">{option.optionText}</p>
                <Label className="flex items-center gap-2">
                  <Checkbox
                    checked={option.isCorrect}
                    onCheckedChange={(checked) =>
                      changeOption.mutate({ id: option.id, fields: { isCorrect: Boolean(checked) } })
                    }
                  />
                  Correct
                </Label>
                <Button variant="ghost" size="icon" onClick={() => removeOptionMutation.mutate(option.id)}>
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <Label>New option</Label>
            <Input className="mt-2" value={optionText} onChange={(e) => setOptionText(e.target.value)} />
            <Label className="mt-3 flex items-center gap-2">
              <Checkbox checked={isCorrect} onCheckedChange={(checked) => setIsCorrect(Boolean(checked))} />
              This is a correct answer
            </Label>
            <Button className="mt-4" onClick={() => add.mutate()} disabled={!optionText.trim()}>
              <Plus /> Add option
            </Button>
          </div>
        </div>
      ) : (
        solution.isLoading ? (
          <div className="text-sm text-muted-foreground">Loading solution…</div>
        ) : (
          <SolutionEditor
            key={`${questionId}:${solution.data?.id ?? 'new'}`}
            questionId={questionId}
            solution={solution.data}
          />
        )
      )}
    </>
  );
}

function SolutionEditor({ questionId, solution }) {
  const qc = useQueryClient();
  const [explanation, setExplanation] = useState(solution?.explanationText ?? '');
  const save = useMutation({
    mutationFn: () => saveSolution(questionId, { explanationText: explanation.trim() }, Boolean(solution)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'solution', questionId] });
      toast.success('Solution saved');
    },
    onError: (e) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: () => deleteSolution(questionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'solution', questionId] });
      setExplanation('');
      toast.success('Solution deleted');
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="max-w-3xl rounded-2xl border bg-card p-5">
      <Label>Explanation</Label>
      <Textarea
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
        className="mt-2 min-h-56"
        placeholder="Write the step-by-step solution. KaTeX notation is supported in the student app."
      />
      <div className="mt-4 flex gap-2">
        <Button onClick={() => save.mutate()} disabled={!explanation.trim()}><Save /> Save solution</Button>
        {solution && <Button variant="destructive" onClick={() => remove.mutate()}><Trash2 /> Delete</Button>}
      </div>
    </div>
  );
}
