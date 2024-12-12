<?php

namespace App\Filament\Resources\PapanBungaResource\Pages;

use App\Filament\Resources\PapanBungaResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreatePapanBunga extends CreateRecord
{
    protected static string $resource = PapanBungaResource::class;
    protected static bool $canCreateAnother = false;
    public function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
