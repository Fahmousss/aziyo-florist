<?php

namespace App\Filament\Resources\PapanBungaResource\Pages;

use App\Filament\Resources\PapanBungaResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPapanBunga extends EditRecord
{
    protected static string $resource = PapanBungaResource::class;

    public function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
