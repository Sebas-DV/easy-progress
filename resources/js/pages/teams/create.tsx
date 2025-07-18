import AnimatedTextPanel from '@/components/animated-text-panel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useCreateTeam } from '@/hooks/queries/use-team';
import TeamCreate from '@/pages/teams/partials/form';
import { useTeamStore } from '@/stores/team-store';
import { CreateTeamRequest } from '@/types/team';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Edit2, Plus, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Member {
  email: string;
  role: string;
}

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
];

export default function TeamCreationModal() {
  const { isOpen, setIsOpen } = useTeamStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [teamData, setTeamData] = useState<CreateTeamRequest>({
    name: '',
    description: '',
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState(ROLE_OPTIONS[0].value);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState(ROLE_OPTIONS[0].value);
  const [step1Error, setStep1Error] = useState(false);

  const { mutate: createTeam } = useCreateTeam();

  // Reiniciar datos cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      setTeamData({ name: '', description: '' });
      setMembers([]);
      setCurrentStep(1);
      setStep1Error(false);
      setNewMemberEmail('');
      setNewMemberRole(ROLE_OPTIONS[0].value);
      cancelEdit();
    }
  }, [isOpen]);

  const addMember = () => {
    const email = newMemberEmail.trim();
    const role = newMemberRole;

    if (email && role && !members.some((m) => m.email === email)) {
      setMembers([...members, { email, role }]);
      setNewMemberEmail('');
      setNewMemberRole(ROLE_OPTIONS[0].value);
    }
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const email = editEmail.trim();
    const role = editRole;

    const updatedMembers = members.map((m, i) => (i === editingIndex ? { email, role } : m));
    setMembers(updatedMembers);
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditEmail('');
    setEditRole(ROLE_OPTIONS[0].value);
  };

  const removeMember = (index: number) => {
    const filteredMembers = members.filter((_, i) => i !== index);
    setMembers(filteredMembers);
    if (editingIndex === index) cancelEdit();
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditEmail(members[index].email);
    setEditRole(members[index].role);
  };

  const handleTeamSubmit = async (data: CreateTeamRequest) => {
    // Guardar los datos del equipo y pasar al siguiente paso
    setTeamData(data);
    setStep1Error(false);
    setCurrentStep(2);
  };

  const handleNext = () => {
    // Disparar submit del formulario mediante el evento del DOM
    const form = document.getElementById('team-form') as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleFinalSubmit = async () => {
    try {
      if (!teamData.name?.trim()) {
        setCurrentStep(1);
        setStep1Error(true);
        return;
      }

      const createTeamData: CreateTeamRequest & { members?: Member[] } = {
        name: teamData.name,
        description: teamData.description || '',
        members: members,
      };

      createTeam(createTeamData);
      handleClose();
    } catch {
      throw new Error('Error creating team');
    }
  };

  const renderStepContent = () => (
    <div className="relative flex-1">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 flex flex-col"
        >
          {currentStep === 1 ? (
            <>
              <DialogHeader className="mb-6 sm:mb-8">
                <DialogTitle className="text-left text-2xl leading-tight font-bold sm:text-3xl lg:text-4xl">
                  Welcome.
                  <br />
                  Let's create your team
                </DialogTitle>
                <DialogDescription>Create a new team to collaborate with others. Fill in your team details below to get started.</DialogDescription>
              </DialogHeader>
              <div className="flex-1 space-y-4 sm:space-y-6">
                <TeamCreate className="space-y-6" onSubmit={handleTeamSubmit} team={teamData} id="team-form" />
                {step1Error && (
                  <div className="text-sm text-red-500">
                    <p>Por favor corrige los errores antes de continuar</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <DialogHeader className="mb-6 sm:mb-8">
                <DialogTitle className="text-left text-2xl leading-tight font-bold sm:text-3xl lg:text-4xl">Add Team Members</DialogTitle>
                <DialogDescription>
                  <p className="text-sm text-gray-600">
                    Add team members by entering their email addresses and assigning roles. Team members will receive an invitation to join your team.
                    You can modify their roles or remove them at any time.
                  </p>
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 space-y-4 overflow-hidden sm:space-y-6">
                <Card className="flex h-full flex-col border-gray-200">
                  <CardContent className="flex flex-1 flex-col space-y-4 overflow-hidden p-4 sm:p-6">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <Input
                        placeholder="Member email"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        className="text-sm sm:text-base"
                      />
                      <Select value={newMemberRole} onValueChange={setNewMemberRole}>
                        <SelectTrigger className="w-full text-sm">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={addMember}
                        size="sm"
                        variant="outline"
                        disabled={!newMemberEmail.trim()}
                        className="mt-2 w-full sm:mt-0 sm:w-auto"
                      >
                        <Plus className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Add Member</span>
                      </Button>
                    </div>

                    {members.length > 0 ? (
                      <>
                        <Separator className="mt-4" />
                        <div className="flex flex-1 flex-col space-y-3 overflow-hidden">
                          <Label className="text-sm font-medium">Team Members ({members.length})</Label>
                          <ScrollArea className="max-h-[300px] min-h-[120px] w-full flex-1 rounded-md border p-2">
                            <div className="flex flex-col gap-2 pr-4">
                              {members.map((m, index) => (
                                <div key={index} className="flex items-center gap-2 rounded-lg bg-gray-50 p-2">
                                  {editingIndex === index ? (
                                    <>
                                      <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="flex-1 text-sm" />
                                      <Select value={editRole} onValueChange={setEditRole}>
                                        <SelectTrigger className="w-32 text-sm">
                                          <SelectValue placeholder="Role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {ROLE_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                              {opt.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <Button variant="ghost" size="sm" onClick={saveEdit} className="p-1">
                                        <Check className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="sm" onClick={cancelEdit} className="p-1">
                                        <XCircle className="h-4 w-4" />
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <span className="flex-1 truncate text-sm font-medium">{m.email}</span>
                                      <span className="rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-600">
                                        {ROLE_OPTIONS.find((o) => o.value === m.role)?.label}
                                      </span>
                                      <Button variant="ghost" size="sm" onClick={() => startEdit(index)} className="p-1 hover:bg-gray-200">
                                        <Edit2 className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeMember(index)}
                                        className="p-1 hover:bg-red-100 hover:text-red-600"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      </>
                    ) : (
                      <div className="py-8 text-center text-gray-500">
                        <p className="text-sm sm:text-base">No members added yet</p>
                        <p className="mt-1 text-xs sm:text-sm">Provide email and role above to invite</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  const renderFooterButtons = () => (
    <>
      {currentStep === 1 ? (
        <>
          <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent sm:min-w-[100px] sm:flex-none">
            Cancelar
          </Button>
          <Button className="flex-1 bg-black hover:bg-gray-800 sm:min-w-[100px] sm:flex-none" onClick={handleNext}>
            Siguiente
            <ArrowRight className="mr-2 h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" onClick={handleBack} className="flex-1 bg-transparent sm:min-w-[100px] sm:flex-none">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Atrás
          </Button>
          <Button className="flex-1 bg-black hover:bg-gray-800 sm:min-w-[120px] sm:flex-none" onClick={handleFinalSubmit}>
            Save Team
          </Button>
        </>
      )}
    </>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[90vh] w-full max-w-5xl overflow-hidden p-0">
        <div className="flex min-h-[600px] flex-col lg:flex-row">
          <div className="order-2 flex flex-1 flex-col p-6 sm:p-8 lg:order-1 lg:p-6">
            {renderStepContent()}
            <div className="mt-auto flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">{renderFooterButtons()}</div>
          </div>
          <div className="order-1 hidden min-h-[200px] flex-1 bg-gray-100 md:flex lg:order-2 lg:min-h-[600px]">
            <AnimatedTextPanel />
            <div className="absolute inset-0 bg-black/10 lg:hidden" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
