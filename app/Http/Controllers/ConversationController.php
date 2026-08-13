<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMessageRequest;
use App\Models\Conversation;
use App\Models\Lease;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ConversationController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Conversation::class);

        $user = $request->user();

        // 1. Fetch conversations for user
        $conversations = Conversation::with(['landlord:id,name', 'tenant:id,name', 'unit:id,name'])
            ->when($user->hasRole('landlord'), fn ($q) => $q->where('landlord_id', $user->id))
            ->when($user->hasRole('tenant'), fn ($q) => $q->where('tenant_id', $user->id))
            ->latest('last_message_at')
            ->get();

        // 2. If tenant has no conversation, auto-create one with landlord
        if ($conversations->isEmpty() && $user->hasRole('tenant')) {
            $lease = Lease::with('unit.property')->where('tenant_id', $user->id)->first();
            $landlordId = $lease?->unit?->property?->landlord_id;

            if ($landlordId) {
                $conv = Conversation::create([
                    'tenant_id' => $user->id,
                    'landlord_id' => $landlordId,
                    'unit_id' => $lease?->unit_id,
                    'last_message_at' => now(),
                ]);
                $conversations = collect([$conv->load(['landlord:id,name', 'tenant:id,name', 'unit:id,name'])]);
            }
        }

        // 3. Select active conversation
        $activeConv = $conversations->first();

        $activeMessages = [];
        if ($activeConv) {
            $activeMessages = $activeConv->messages()
                ->orderBy('created_at', 'asc')
                ->get()
                ->map(fn ($m) => [
                    'id' => $m->id,
                    'sender_id' => $m->sender_id,
                    'from' => $m->sender_id === $user->id ? 'me' : 'them',
                    'body' => $m->body,
                    'time' => $m->created_at->format('g:ia'),
                ]);

            // Mark unread messages as read
            $activeConv->messages()
                ->where('sender_id', '!=', $user->id)
                ->whereNull('read_at')
                ->update(['read_at' => now()]);
        }

        $formattedConversations = $conversations->map(function ($conv) use ($user) {
            $contact = $user->hasRole('landlord') ? $conv->tenant : $conv->landlord;
            $lastMsg = $conv->messages()->latest()->first();

            return [
                'id' => $conv->id,
                'name' => $contact?->name ?? 'Property Manager',
                'unit' => $conv->unit ? "Unit {$conv->unit->name}" : 'General',
                'last' => $lastMsg?->body ?? 'No messages yet',
                'time' => $lastMsg ? $lastMsg->created_at->diffForHumans() : '',
            ];
        });

        $page = $user->hasRole('tenant') ? 'tenant/messages' : 'dashboard/messages';

        return Inertia::render($page, [
            'conversations' => $formattedConversations,
            'activeConversation' => $activeConv ? [
                'id' => $activeConv->id,
                'name' => ($user->hasRole('tenant') ? $activeConv->landlord?->name : $activeConv->tenant?->name) ?? 'Property Manager',
            ] : null,
            'initialMessages' => $activeMessages,
            'currentUserId' => $user->id,
        ]);
    }

    public function sendMessage(StoreMessageRequest $request, Conversation $conversation)
    {
        Gate::authorize('view', $conversation);

        $message = $conversation->messages()->create([
            'sender_id' => $request->user()->id,
            'body' => $request->validated()['body'],
        ]);

        $conversation->update(['last_message_at' => now()]);

        return response()->json([
            'id' => $message->id,
            'sender_id' => $message->sender_id,
            'from' => 'me',
            'body' => $message->body,
            'time' => $message->created_at->format('g:ia'),
        ]);
    }
}